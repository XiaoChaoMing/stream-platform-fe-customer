import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

const ChannelPage = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current tab from the URL path or default to 'home'
  const getCurrentTab = () => {
    const path = location.pathname;
    const tab = path.split("/").pop();
    return tab === channelId ? "home" : tab || "home";
  };

  const [currentTab, setCurrentTab] = useState(getCurrentTab());

  // Update tab when URL changes
  useEffect(() => {
    setCurrentTab(getCurrentTab());
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    navigate(
      value === "home"
        ? `/channel/${channelId}`
        : `/channel/${channelId}/${value}`
    );
  };

  return (
    <div className="container mx-auto py-6">
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="bg-transparent">
          <TabsTrigger
            value="home"
            className=" cursor-pointer relative bg-transparent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-[var(--chart-4)] after:transition-transform data-[state=active]:after:scale-x-100"
          >
            Home
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className=" cursor-pointer relative bg-transparent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-[var(--chart-4)] after:transition-transform data-[state=active]:after:scale-x-100"
          >
            About
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className=" cursor-pointer relative bg-transparent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-[var(--chart-4)] after:transition-transform data-[state=active]:after:scale-x-100"
          >
            Schedule
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className=" cursor-pointer relative bg-transparent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-[var(--chart-4)] after:transition-transform data-[state=active]:after:scale-x-100"
          >
            Videos
          </TabsTrigger>
        </TabsList>
        <TabsContent value={currentTab}>
          <Outlet />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChannelPage;
