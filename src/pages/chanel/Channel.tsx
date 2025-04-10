import MainLayout from "@/layouts/mainLayout";
import defaultVideo from "@/assets/csVideo.mp4";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";

const Channel = () => {
  return (
    <MainLayout>
      <div className="relative h-full w-full overflow-y-scroll bg-purple-500">
        <video autoPlay muted loop>
          <source src={defaultVideo} />
        </video>
        <div className="absolute top-100 h-[10000px] w-[95%] rounded-md bg-[var(--background)] p-4">
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
