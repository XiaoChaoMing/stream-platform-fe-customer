import MainLayout from "@/layouts/mainLayout";

import { Outlet, useParams } from "react-router-dom";
// import { useChannelQuery } from "@/hooks/useChannelQuery";
// import { useState } from "react";
// import { useSocket } from "@/components/base/socketContext/SocketContext";
// import { useStore } from "@/store/useStore";
import NavigationBar from "./components/NavigationBar";
import { Separator } from "@/components/ui/separator";
const Profile = () => {
  const { username } = useParams<{ username: string }>();

//   const [bannerKey, setBannerKey] = useState(Date.now());
//   //denied to leave stream due to visibility change


//   const { data: channelData, isLoading, error, refetch } = useChannelQuery(username);

//   const {user} = useStore();

//   const {socket} = useSocket();
  


  

//   if (!username) {
//     return (
//       <MainLayout>
//         <div className="flex h-full items-center justify-center">
//           <h1 className="text-2xl text-foreground">Channel not found</h1>
//         </div>
//       </MainLayout>
//     );
//   }
//   if (isLoading) {
//     return (
//       <MainLayout>
//         <div className="flex h-full items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
//         </div>
//       </MainLayout> 
//     )
//   }
//   if (error) {
//     return (
//       <MainLayout>
//         <div className="flex h-full items-center justify-center">
//           <h1 className="text-2xl text-foreground">Error loading channel: {(error as Error).message}</h1>
//         </div>
//       </MainLayout>
//     );
//   }

  return (
    <MainLayout>
      <div className="relative h-full w-full overflow-y-scroll bg-accent">
        <div className="sm:absolute min-h-full w-full sm:rounded-md rounded-none bg-background p-4">
        <h1 className="text-3xl font-bold text-start">Profile</h1>
        <h1 className="text-md font-semibold text-start">Manage your account settings and set e-mail preferences.</h1>
        <Separator className="my-4" />
          <div className="flex flex-row h-full">
          <NavigationBar />
          <div className="mt-5 w-full">
            <Outlet />
          </div>
          </div>
          <div className="h-10">
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
