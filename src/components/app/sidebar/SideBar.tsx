import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import ChannelCard from "../channelCard/ChannelCard";
import { useQuery } from "@tanstack/react-query";
import { channelService } from "@/services/app/channel";

// Use the channel interface that matches what we need for the sidebar
interface Channel {
  id: string;
  username: string;
  profileImage: string;
  description: string;
  isLive: boolean;
  category: string;
}

// Create a new service function to get recommended channels
const getRecommendedChannels = async (): Promise<Channel[]> => {
  // For now, we'll use our mock data
  // In a real implementation, this would be a separate API endpoint
  const mockUsernames = ['summit1g', 'ninja'];
  const fetchedChannels = await Promise.all(
    mockUsernames.map(username => channelService.getChannelByUsername(username))
  );
  
  return fetchedChannels.map(channel => ({
    id: channel.id,
    username: channel.username,
    profileImage: channel.profileImage,
    description: channel.description,
    isLive: channel.isLive,
    category: channel.category
  }));
};

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch recommended channels using React Query
  const { data: recommendedChannels, isLoading } = useQuery({
    queryKey: ['recommendedChannels'],
    queryFn: getRecommendedChannels,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  return (
    <div
      className={cn(
        "flex max-h-full flex-col gap-2 bg-[var(--primary-foreground)] px-4 py-1 transition-all duration-300",
        isCollapsed ? "" : "min-w-[320px]"
      )}
    >
      <div
        className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}
      >
        {!isCollapsed && <p>RECOMMENDED CHANNELS</p>}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="hover:bg-muted flex h-9 w-9 items-center justify-center rounded-md"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ArrowRightToLine className="h-4 w-4" />
              ) : (
                <ArrowLeftToLine className="h-4 w-4" />
              )}
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isCollapsed ? "Expand" : "Collapse"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <div className="text-sm text-gray-400 p-2">Loading channels...</div>
        ) : recommendedChannels && recommendedChannels.length > 0 ? (
          recommendedChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channelId={channel.username} // Using username instead of id for routing
              username={channel.username}
              imageUrl={channel.profileImage}
              detail={channel.category}
              isLive={channel.isLive}
              viewCount={Math.floor(Math.random() * 15000)}
              isCollapsed={isCollapsed}
            />
          ))
        ) : (
          <div className="text-sm text-gray-400 p-2">No recommended channels</div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
