import MainLayout from "@/layouts/mainLayout";
import defaultVideo from "@/assets/csVideo.mp4";
import Header from "./components/Header";
import { Outlet, useParams } from "react-router-dom";
import { useChannelQuery } from "@/hooks/useChannelQuery";
import { useEffect, useMemo, useState, useRef } from "react";
import { useSocket } from "@/components/base/socketContext/SocketContext";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

const Channel = () => {
  const { username } = useParams<{ username: string }>();

  const [bannerKey, setBannerKey] = useState(Date.now());
  //denied to leave stream due to visibility change
  const leftDueToVisibility = useRef(false);

  const { data: channelData, isLoading, error, refetch } = useChannelQuery(username);

  const {user} = useStore();

  const {socket} = useSocket();
  
  useEffect(() => {
    if (!socket || !channelData?.livestream || !user) return;

    const isStreamer = user.user_id === channelData.id;
    const isLive = channelData.livestream.status === "live";
    const streamId = channelData.livestream.stream_id;

    if (!isStreamer && isLive) {
      // Handle join error
      const handleJoinError = (error: { message: string; status: number }) => {
        toast.error(error.message || 'Failed to join stream');
        socket.off('streamError', handleJoinError);
      };

      // Handle stream end
      const handleStreamEnd = () => {
        socket.emit('leaveStream', {
          stream_id: streamId,
          user_id: user.user_id
        });
      };

      // Join stream function for reuse
      const joinStream = () => {
        socket.emit('joinStream', {
          stream_id: streamId,
          user_id: user.user_id
        });
      };

      // Listen for responses
      socket.on('streamError', handleJoinError);
      socket.on('streamEnded', handleStreamEnd);

      // Join stream room initially
      joinStream();

      // Cleanup function
      const cleanup = () => {
        socket.off('streamError', handleJoinError);
        socket.off('streamEnded', handleStreamEnd);
        
        if (isLive) {
          socket.emit('leaveStream', {
            stream_id: streamId,
            user_id: user.user_id
          });
        }
      };

      // Handle page visibility change
      const handleVisibilityChange = () => {
        if (document.hidden && isLive) {
          // User is leaving the tab
          socket.emit('leaveStream', {
            stream_id: streamId,
            user_id: user.user_id
          });
          leftDueToVisibility.current = true;
        } else if (!document.hidden && isLive && leftDueToVisibility.current) {
          // User has returned to the tab - rejoin the stream
          joinStream();
          leftDueToVisibility.current = false;
        }
      };

      // Add visibility change listener
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        cleanup();
      };
    }
  }, [socket, channelData?.livestream, user]);
  useEffect(() => {
    const handleProfileUpdate = (event: any) => {
      if (event.detail && event.detail.banner) {
        refetch();
        setBannerKey(Date.now());
      }
    };
    
    const handleVideoUpload = () => {
      refetch();
    };
    
    // Add event listener for profile updates
    window.addEventListener('profile-updated', handleProfileUpdate as EventListener);
    // Add event listener for video uploads
    window.addEventListener('video-uploaded', handleVideoUpload);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate as EventListener);
      window.removeEventListener('video-uploaded', handleVideoUpload);
    };
  }, [refetch]);

  

  const memoizedHeader = useMemo(() => <Header />, [username]);

  if (!username) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <h1 className="text-2xl text-foreground">Channel not found</h1>
        </div>
      </MainLayout>
    );
  }
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </MainLayout> 
    )
  }
  if (error) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <h1 className="text-2xl text-foreground">Error loading channel: {(error as Error).message}</h1>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative h-full w-full overflow-y-scroll bg-accent">
      {(() => {
          const isImage = channelData?.bannerImage?.match(/\.(jpeg|jpg|png|gif|webp)$/i);
          const isVideo = channelData?.bannerImage?.match(/\.(mp4|webm|ogg)$/i);

          if (isImage) {
            // Add key to force refresh when banner changes
            return <img key={`banner-img-${bannerKey}`} src={`${channelData?.bannerImage}?v=${bannerKey}`} alt="Banner" />;
          } else if (isVideo) {
            // Add key to force refresh when banner changes
            return (
              <video key={`banner-video-${bannerKey}`} autoPlay muted loop>
                <source src={`${channelData?.bannerImage}?v=${bannerKey}`} type="video/mp4" />
              </video>
            );
          } else {
            return <video autoPlay muted loop>
              <source src={defaultVideo} type="video/mp4" />
            </video>;
          }
        })()}

        <div className="sm:absolute static sm:top-100 min-h-full sm:w-[95%] w-full sm:rounded-md rounded-none bg-background p-4">
          {/* head channel - memoized to prevent re-renders */}
          {memoizedHeader}
          
          {/* main content - will be updated via Outlet when routes change */}
          <div className="mt-5">
            <Outlet />
          </div>
          <div className="h-10">

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Channel;
