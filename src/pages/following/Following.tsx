import MainLayout from "@/layouts/mainLayout";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

const Following = () => {
  return (
    <MainLayout>
      <div className="relative h-full w-full overflow-y-scroll bg-accent">
        <div className="min-h-full w-full rounded-md bg-background p-4">
          {/* header */}
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

export default Following;
