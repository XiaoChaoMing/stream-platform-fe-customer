import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { VideoInfo } from "../components/VideoInfo";
import { RelatedVideos } from "../components/RelatedVideos";
import { ProfileInfo } from "../components/ProfileInfo";
import { CommentSection } from "../components/CommentSection";
import MainLayout from "@/layouts/mainLayout";
import { useVideoQuery } from "@/hooks/useVideoQuery";
import { format } from "date-fns";

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Use the custom hook to fetch video data
  const { getVideoById } = useVideoQuery();
  const { data: video, isLoading, error } = getVideoById(id);
  
  
  // State to track the current view count (updated in real-time)
  const [currentViewCount, setCurrentViewCount] = useState<number | undefined>(undefined);
  
  // Handler for view count updates from VideoPlayer component
  const handleViewCountUpdate = (newViewCount: number) => {
    setCurrentViewCount(newViewCount);
  };

  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !video) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Video not found</h2>
            <p className="text-neutral-500">The video you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative h-full w-full overflow-y-scroll">
          <div className="absolute w-full h-full rounded-md bg-[var(--background)] p-2 sm:p-0">
              <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main content - Video and info */}
                  <div className="lg:col-span-2">
                    <div className="rounded-md overflow-hidden bg-card">
                      {/* Video Player */}
                      <VideoPlayer 
                        videoUrl={video.video_url} 
                        videoId={video.video_id} 
                        initialViewCount={video.view_count}
                        onViewCountUpdate={handleViewCountUpdate}
                      />
                      
                      {/* Video Info */}
                      <div className="p-4">
                        <VideoInfo video={video} currentViewCount={currentViewCount} />
                        
                        {/* Video Description */}
                        {video.description && (
                          <div className="mt-4 p-4 bg-muted rounded-md">
                            <h3 className="text-lg font-medium mb-2 text-start">Description</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-line text-start">
                              {video.description}
                            </p>
                          </div>
                        )}
                        
                        {/* Channel/Streamer Info */}
                        <div className="mt-6">
                          <ProfileInfo user={video.user} />
                        </div>
                        
                        {/* Comments Section */}
                        <CommentSection videoId={video.video_id} />
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <div className="space-y-6">
                      {/* Related Videos */}
                      <div className="rounded-md overflow-hidden bg-card">
                        <RelatedVideos currentVideoId={String(video.video_id)} />
                      </div>
                    </div>
                  </div>
                  
                </div>
                        
              </div>
              <div className="h-10"></div>
          </div>
      </div>
      
    </MainLayout>
  );
};

export default VideoDetail; 