import React, { useEffect, useState } from 'react';
import { useVideoQuery, IPaginationParams } from '@/hooks/useVideoQuery';
import VideoCard from '@/components/app/streamCard/VideoCard';
import { useInView } from 'react-intersection-observer';

interface RelatedVideosProps {
  currentVideoId: string;
}


const RELATED_VIDEOS_LIMIT = 5;

export const RelatedVideos: React.FC<RelatedVideosProps> = ({ currentVideoId }) => {
  // State for pagination
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  // Set up pagination params
  const paginationParams: IPaginationParams = {
    limit: RELATED_VIDEOS_LIMIT * 2, 
    page: page
  };
  
  const { allVideos, isLoadingAllVideos, allVideosError } = useVideoQuery(paginationParams);
  
  // Store filtered videos
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
  
  // Setup intersection observer
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px', 
    triggerOnce: false,
  });
  
  // Check for empty response or errors and update hasMore accordingly
  useEffect(() => {
    if (allVideosError || (allVideos && allVideos.length === 0)) {
      setHasMore(false);
    }
  }, [allVideos, allVideosError]);
  
  // Load more videos when the last element is in view
  useEffect(() => {
    if (inView && hasMore && !isLoadingAllVideos) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView, hasMore, isLoadingAllVideos]);
  
  // Process and filter videos when data changes
  useEffect(() => {
    if (allVideos && allVideos.length > 0) {
      // Filter out the current video and transform data for VideoCard
      const filtered = allVideos
        .filter(video => video.video_id.toString() !== currentVideoId)
        .map(video => ({
          video_id: video.video_id,
          thumbnailUrl: video.thumbnail_url || '',
          title: video.title,
          duration: video.duration?.toString() || '0:00',
          username: video.user?.username || 'Unknown User',
          views: video.view_count || 0,
          createdAt: video.created_at
        }));
      
      // If we received fewer items than requested, there are no more items to load
      if (filtered.length < RELATED_VIDEOS_LIMIT) {
        setHasMore(false);
      }
      
      // Append new videos to existing filtered videos
      if (page === 1) {
        setFilteredVideos(filtered.slice(0, RELATED_VIDEOS_LIMIT));
      } else {
        setFilteredVideos(prevVideos => {
          // Combine previous videos with new ones, removing duplicates
          const newVideos = [...prevVideos];
          filtered.forEach(video => {
            const exists = newVideos.some(v => v.video_id === video.video_id);
            if (!exists) {
              newVideos.push(video);
            }
          });
          return newVideos;
        });
      }
    }
  }, [allVideos, currentVideoId, page]);
  
  // Navigate to video details when a video is clicked
  const handleVideoClick = (videoId: string) => {
    window.location.href = `/video/${videoId}`;
  };
  console.log(filteredVideos);

  return (
    <div className="related-videos p-4">
      <h3 className="text-lg font-medium mb-4 text-start">Related Videos</h3>
      
      {filteredVideos.length > 0 ? (
        <div className="space-y-4">
          {filteredVideos.map((video, index) => (
            <div 
              key={video.video_id} 
              onClick={() => handleVideoClick(video.video_id)}
              ref={index === filteredVideos.length - 1 ? ref : undefined}
            >
              <VideoCard 
                video={video}
                variant="sm"
              />
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoadingAllVideos && hasMore && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent"></div>
            </div>
          )}
          
          {/* End of content message */}
          {!hasMore && filteredVideos.length > 0 && (
            <div className="text-center py-2 text-sm text-muted-foreground">
              No more videos to load
            </div>
          )}
        </div>
      ) : isLoadingAllVideos ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          No related videos found
        </div>
      )}
    </div>
  );
}; 