import { useState, useEffect, useCallback, useMemo } from 'react';
import { useChannelStore } from "@/store/slices/channelSlice";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useChannelQuery } from "@/hooks/useChannelQuery";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UploadVideoModal } from "@/components/app/video/UploadVideoModal";
import VideoCard from "@/components/app/streamCard/VideoCard";
import { useInView } from 'react-intersection-observer';

export default function Video() {
  const { username } = useParams<{ username: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 8; 
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px', 
  });
  
  const { videosLoading, refetch: refetchChannelData, videos } = useChannelQuery(
    username, 
    useMemo(() => ({ limit: videosPerPage, page: currentPage }), [currentPage, videosPerPage])
  );

  const { 
    isLoading, 
    isOwnChannel 
  } = useChannelStore();

  useEffect(() => {
    if (!videos) return;
    
    if (videos.length > 0) {
      setAllVideos(prev => {
        const newVideos = videos.filter(
          newVideo => !prev.some(existingVideo => existingVideo.video_id === newVideo.video_id)
        );
        
        if (newVideos.length === 0) return prev;
        
        return [...prev, ...newVideos];
      });
      
      setHasMore(videos.length >= videosPerPage);
    } else if (videos.length === 0 && currentPage === 1) {
      setAllVideos([]);
      setHasMore(false);
    }
  }, [videos, currentPage]);

  useEffect(() => {
    if (inView && hasMore && !videosLoading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [inView, hasMore, videosLoading]);

  const handleVideoUploadSuccess = useCallback(() => {
    setCurrentPage(1);
    setAllVideos([]);
    setHasMore(true);
    refetchChannelData();
  }, [refetchChannelData]);

  const navigateToVideo = useCallback((videoId: string | number) => {
    navigate(`/video/${videoId}`);
  }, [navigate]);
  
  if (isLoading) {
    return <div className="text-foreground p-4">Loading videos...</div>;
  }
  
  const uploadButton = useMemo(() => 
    isOwnChannel && (
      <UploadVideoModal 
        triggerButton={
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('Upload Video')}
          </Button>
        }
        onSuccess={handleVideoUploadSuccess}
      />
    )
  , [isOwnChannel, handleVideoUploadSuccess, t]);

  const categoryButtons = useMemo(() => (
    <div className="flex overflow-x-auto mb-4 space-x-2">
      <Button className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap">All Videos</Button>
      <Button variant="ghost" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap">Recent Broadcasts</Button>
      <Button variant="ghost" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap">Clips</Button>
      <Button variant="ghost" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap">Highlights</Button>
      <Button variant="ghost" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap">Collections</Button>
      {isOwnChannel && (
        <Button variant="ghost" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      )}
    </div>
  ), [isOwnChannel]);

  const videoGrid = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {allVideos.map(video => (
        <VideoCard 
          onClick={() => navigateToVideo(video.video_id)} 
          key={video.video_id} 
          video={video} 
        />
      ))}
    </div>
  ), [allVideos, navigateToVideo]);

  const loadingIndicator = useMemo(() => (
    hasMore && (
      <div 
        ref={loadMoreRef} 
        className="flex justify-center items-center py-8"
      >
        {videosLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
        ) : (
          <p className="text-muted-foreground">Scroll for more videos</p>
        )}
      </div>
    )
  ), [hasMore, videosLoading, loadMoreRef]);

  const noVideosMessage = useMemo(() => (
    allVideos.length === 0 && !videosLoading && (
      <div className="text-center py-10">
        <h3 className="text-foreground text-lg">No videos found</h3>
        <p className="text-muted-foreground mt-2">This channel hasn't uploaded any videos yet.</p>
      </div>
    )
  ), [allVideos.length, videosLoading]);

  const backToTopButton = useMemo(() => (
    allVideos.length > videosPerPage && (
      <div className="flex justify-center mt-6">
        <Button 
          variant="outline" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to Top
        </Button>
      </div>
    )
  ), [allVideos.length]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground text-start">{t('channel.videos')}</h1>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground text-xl font-semibold">{t('channel.videos')}</h2>
        {uploadButton}
      </div>
      
      {/* Video Categories */}
      {categoryButtons}
      
      {/* Videos Grid */}
      {videoGrid}
      
      {/* No videos message */}
      {noVideosMessage}
      
      {/* Loading indicator */}
      {loadingIndicator}
      
      {/* Back to top button */}
      {backToTopButton}
    </div>
  );
}
