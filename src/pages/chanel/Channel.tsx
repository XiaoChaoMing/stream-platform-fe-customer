import MainLayout from "@/layouts/mainLayout";
import defaultVideo from "@/assets/csVideo.mp4";
import Header from "./components/Header";
import { Outlet, useParams } from "react-router-dom";
import { useChannelQuery } from "@/hooks/useChannelQuery";
import { useMemo } from "react";

const Channel = () => {
  const { username } = useParams<{ username: string }>();
  // Fetch channel data when component mounts
  const { data,isLoading, error } = useChannelQuery(username);

  // Memoize the Header component to prevent re-renders on tab changes
  const memoizedHeader = useMemo(() => <Header />, [username]);

  // If no username, render a fallback or error
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
          <h1 className="text-2xl text-foreground">Loading...</h1>
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
          const isImage = data?.bannerImage?.match(/\.(jpeg|jpg|png|gif|webp)$/i);
          const isVideo = data?.bannerImage?.match(/\.(mp4|webm|ogg)$/i);

          if (isImage) {
            return <img src={data?.bannerImage} alt="Banner" />;
          } else if (isVideo) {
            return (
              <video autoPlay muted loop>
                <source src={data?.bannerImage} type="video/mp4" />
              </video>
            );
          } else {
            return <video autoPlay muted loop>
            <source src={defaultVideo} type="video/mp4" />
          </video>;
          }
        })()}

        <div className="absolute top-100 min-h-full w-[95%] rounded-md bg-background p-4">
          {/* head channel - memoized to prevent re-renders */}
          {memoizedHeader}
          
          {/* main content - will be updated via Outlet when routes change */}
          <div className="mt-5">
            <Outlet />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Channel;
