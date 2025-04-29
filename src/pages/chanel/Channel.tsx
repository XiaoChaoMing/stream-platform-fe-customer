import MainLayout from "@/layouts/mainLayout";
import defaultVideo from "@/assets/csVideo.mp4";
import Header from "./components/Header";
import { Outlet, useParams } from "react-router-dom";
import { useChannelQuery } from "@/hooks/useChannelQuery";

const Channel = () => {
  const { username } = useParams<{ username: string }>();
  
  // Fetch channel data when component mounts
  const { isLoading, error } = useChannelQuery(username);

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
        <video autoPlay muted loop>
          <source src={defaultVideo} />
        </video>
        <div className="absolute top-100 min-h-full w-[95%] rounded-md bg-background p-4">
          {/* head channel */}
          <Header />
          {/* main content */}
          <div className="mt-5">
            <Outlet />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Channel;
