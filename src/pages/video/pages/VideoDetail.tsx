import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { VideoInfo } from "../components/VideoInfo";
import { VideoChat } from "../components/VideoChat";
import { RelatedVideos } from "../components/RelatedVideos";
import { ProfileInfo } from "../components/ProfileInfo";
import MainLayout from "@/layouts/mainLayout";

interface VideoData {
  id: string;
  title: string;
  views: number;
  createdAt: string;
  videoUrl: string;
  thumbnailUrl: string;
  channel: {
    id: string;
    name: string;
    avatar: string;
    followers: number;
  };
}

// Mock video data with Twitch-like structure
const mockVideoData: VideoData = {
  id: "CallousAliveFlyWow-KEVWDJlK7Q8KpkFG",
  title: "test",
  views: 5,
  createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), // 13 days ago
  videoUrl: "https://www.example.com/video.mp4", // This would typically be a real video URL
  thumbnailUrl: "https://static-cdn.jtvnw.net/twitch-clips-thumbnails-prod/CallousAliveFlyWow-KEVWDJlK7Q8KpkFG/d241844a-472a-4723-922c-ed4bcf1a9181/preview.jpg",
  channel: {
    id: "nhatminh1498",
    name: "nhatminh1498",
    avatar: "https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png",
    followers: 0
  }
};

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the video data from an API
    // For now, we'll simulate an API call with a timeout
    const fetchVideoData = async () => {
      setLoading(true);
      try {
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        setVideo(mockVideoData);
      } catch (error) {
        console.error("Failed to fetch video data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  if (!video) {
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
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Video and info */}
          <div className="lg:col-span-2">
            <div className="rounded-md overflow-hidden bg-neutral-900">
              {/* Video Player */}
              <VideoPlayer videoUrl={video.videoUrl} />
              
              {/* Video Info */}
              <div className="p-4">
                <VideoInfo 
                  title={video.title} 
                  views={video.views} 
                  createdAt={video.createdAt} 
                  channelName={video.channel.name}
                />
                
                {/* Channel/Streamer Info */}
                <div className="mt-6">
                  <ProfileInfo 
                    name={video.channel.name}
                    avatar={video.channel.avatar}
                    followers={video.channel.followers}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Chat and related videos */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Chat Section */}
              <div className="rounded-md overflow-hidden bg-neutral-900">
                <VideoChat videoId={video.id} />
              </div>
              
              {/* Related Videos */}
              <div className="rounded-md overflow-hidden bg-neutral-900">
                <RelatedVideos currentVideoId={video.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VideoDetail; 