import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

const FollowingDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current tab from the URL path or default to 'overview'
  const getCurrentTab = () => {
    const path = location.pathname;
    const segments = path.split("/");
    // If we're at /following, use 'overview' as default
    if (segments.length <= 2) return "overview";
    // Otherwise return the last segment of the path
    return segments[2];
  };

  const [currentTab, setCurrentTab] = useState(getCurrentTab());

  // Update tab when URL changes
  useEffect(() => {
    setCurrentTab(getCurrentTab());
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    navigate(
      value === "overview"
        ? `/following`
        : `/following/${value}`
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
            value="overview"
            className="cursor-pointer relative bg-transparent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-[var(--chart-4)] after:transition-transform data-[state=active]:after:scale-x-100"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="live"
            className="cursor-pointer relative bg-transparent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-[var(--chart-4)] after:transition-transform data-[state=active]:after:scale-x-100"
          >
            Live
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="cursor-pointer relative bg-transparent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-[var(--chart-4)] after:transition-transform data-[state=active]:after:scale-x-100"
          >
            Videos
          </TabsTrigger>
          <TabsTrigger
            value="channels"
            className="cursor-pointer relative bg-transparent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-[var(--chart-4)] after:transition-transform data-[state=active]:after:scale-x-100"
          >
            Channels
          </TabsTrigger>
        </TabsList>
        <TabsContent value={currentTab}>
          <Outlet />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowingDetail;
