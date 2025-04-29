import HLSPlayer from "@/pages/video/hls-stream-video";
import { Button } from "@/components/ui/button";
import { useChannelQuery } from "@/hooks/useChannelQuery";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { username } = useParams<{ username: string }>();
  const { t } = useTranslation();
  
  // Use React Query hook to fetch channel data
  const { 
    data: channelData, 
    isLoading, 
  } = useChannelQuery(username);
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
            {channelData?.isLive ? (
              <div className="relative">
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs py-1 px-2 rounded z-10 flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                  LIVE
                </div>
                <HLSPlayer src="https://livestream.streamify.id.vn/hls/adaptive/test.m3u8" />
              </div>
            ) : (
              <div className="relative aspect-video bg-secondary flex items-center justify-center">
                <div className="text-foreground text-lg">
                  {channelData?.displayName} {t('channel.channelOffline')}
                </div>
              </div>
            )}
          </div>
          
          {/* Stream Info */}
          <div className="mt-4">
            <h2 className="text-foreground text-xl font-semibold">
              {channelData?.isLive ? 
                `${t('channel.streamInfo')} ${channelData?.category}` : 
                t('channel.channelOffline')
              }
            </h2>
            <div className="text-muted-foreground mt-1">
              {channelData?.isLive ? 
                `${Math.floor(Math.random() * 10000).toLocaleString()} ${t('channel.viewers')}` : 
                `${t('channel.lastLive')} ${Math.floor(Math.random() * 7) + 1} ${t('channel.daysAgo')}`
              }
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/3">
          {/* About the Channel */}
          <div className="bg-card rounded-md p-4 h-full">
            <h3 className="text-foreground text-lg font-semibold mb-3">{t('channel.about')} {channelData?.displayName}</h3>
            <p className="text-card-foreground text-sm line-clamp-4 mb-4">
              {channelData?.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {channelData?.tags.map((tag, index) => (
                <span key={index} className="bg-secondary cursor-pointer text-secondary-foreground px-2 py-1 rounded text-xs hover:translate-y-[-2px] transition-all duration-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Videos */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-foreground text-xl font-semibold">{t('channel.recentVideos')}</h3>
          <Button variant="link" className="text-secondary-foreground hover:text-purple-500">{t('channel.viewAll')}</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {channelData?.videos.slice(0, 4).map(video => (
            <div key={video.id} className="bg-card rounded-md overflow-hidden cursor-pointer transition-transform hover:translate-y-[-4px]">
              <div className="relative">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-secondary/80 text-secondary-foreground px-1 rounded text-xs py-0.5">
                  {video.duration}
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-foreground text-sm font-medium line-clamp-2">{video.title}</h4>
                <div className="flex justify-between text-muted-foreground text-xs mt-1">
                  <span>{video.views.toLocaleString()} {t('channel.views')}</span>
                  <span>{video.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

