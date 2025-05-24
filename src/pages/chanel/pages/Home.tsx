import HLSPlayer from "@/components/app/video/hls-stream-video";
import { Button } from "@/components/ui/button";
import { useChannelQuery } from "@/hooks/useChannelQuery";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StreamChat } from "@/pages/chanel/components/VideoChat";
import {  Unplug, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocket } from "@/components/base/socketContext/SocketContext";
import VideoCard from "@/components/app/streamCard/VideoCard";

export default function Home() {
  const { username } = useParams<{ username: string }>();
  const { t } = useTranslation();
  const { socket } = useSocket();
  const [viewCount, setViewCount] = useState<number>(0);
  const navigate = useNavigate();
  const recentVideosLimit = 4; // Limit to 4 recent videos for the home page
  
  const navigateToVideo = (videoId: string | number) => {
    navigate(`/video/${videoId}`);
  };
  
  const { 
    data: channelData, 
    isLoading, 
    videos,
    videosLoading
  } = useChannelQuery(username, { limit: recentVideosLimit, page: 1 });

  useEffect(() => {
    if (!socket || !channelData?.livestream?.stream_id) return;

    const handleViewerCount = (data: { streamId: string; count: number }) => {
      if (data.streamId.toString() === channelData.livestream?.stream_id.toString()) {
        setViewCount(data.count);
      }
    };

    const handleError = (error: { message: string; status: number }) => {
      console.error('Error getting viewer count:', error.message);
    };

    // Initial request for viewer count
    if (channelData.livestream.status === 'live') {
      socket.emit('getViewerCount', channelData.livestream.stream_id.toString());
    }

    // Listen for viewer count updates and errors
    socket.on('viewerCountUpdated', handleViewerCount);
    socket.on('streamError', handleError);

    return () => {
      socket.off('viewerCountUpdated', handleViewerCount);
      socket.off('streamError', handleError);
    };
}, [socket, channelData?.livestream]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Channel Header Info */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-2/3">
          {/* Live Stream or Featured Video */}
          <div className="bg-card rounded-md overflow-hidden">
            {channelData?.livestream?.status === "live" ? (
              <div className="relative">
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs py-1 px-2 rounded z-10 flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                  LIVE
                </div>
                <HLSPlayer src={channelData.livestream.stream_url} />
              </div>
            ) : (
              <div className="relative aspect-video bg-secondary flex items-center justify-center">
                <div className="text-foreground text-lg">
                  <Unplug />
                </div>
              </div>
            )}
          </div>
          
          {/* Stream Info */}
          <div className="mt-4 flex flex-row justify-between">
            <div className="flex flex-col gap-2">
            <h2 className="text-foreground text-xl font-semibold text-start">
              {channelData?.livestream?.status === 'live' ? 
                `${t('Live: ')} ${channelData.livestream.title}` : 
                t('channel.channelOffline')
              }
            </h2>
            <h2 className="text-muted-foreground mt-1 text-start">
              {channelData?.livestream?.status === 'live' ? 
                channelData.livestream.description : 
                t('channel.channelOffline')
              }
            </h2>
            </div>
            <div className="text-muted-foreground mt-1 text-start">
              {channelData?.livestream?.status === 'live' ? 
                <h1 className="flex flex-row gap-2 items-center text-red-400">${viewCount.toLocaleString()} ${t('viewers')} <User /></h1>: 
                `${t('lastLive')} ${Math.floor(Math.random() * 7) + 1} ${t('daysAgo')}`
              }
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/3 h-[600px] border border-neutral-800 rounded-md overflow-hidden">
          <StreamChat streamId={channelData?.livestream?.stream_id || 0} />
        </div>
      </div>
      
      {/* Recent Videos */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-foreground text-xl font-semibold">{t('channel.recentVideos')}</h3>
          <Button variant="link" onClick={() => navigate(`/channel/${username}/videos`)} className="text-secondary-foreground hover:text-purple-500 cursor-pointer">
            {t('viewAll')}
          </Button>
        </div>
        
        {videosLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map(video => (
              <VideoCard onClick={() => navigateToVideo(video.video_id)} key={video.video_id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-foreground text-lg">No videos found</h3>
            <p className="text-muted-foreground mt-2">This channel hasn't uploaded any videos yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

