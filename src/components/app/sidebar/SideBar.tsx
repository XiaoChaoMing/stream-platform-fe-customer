import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { useState, memo } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import ChannelCard from "../channelCard/ChannelCard";
import { useQuery } from "@tanstack/react-query";
import { getRecommendedChannels } from "@/services/app/channel";
import { IChannel } from "@/types/app/Ichannel.type";
import { useStore } from "@/store/useStore";

// Create a new service function to get recommended channels
const getRecommendedChannelsForSidebar = async (user_id: number): Promise<IChannel[]> => {
  return await getRecommendedChannels(user_id);
};

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useStore();

  const { data: recommendedChannels, isLoading } = useQuery({
    queryKey: ['recommendedChannels', user?.user_id],
    queryFn: () => getRecommendedChannelsForSidebar(parseInt(user?.user_id || '0')),
    staleTime: 5 * 60 * 1000 
  });

  return (
    <div
      className={cn(
        "sm:flex max-h-full flex-col gap-2 bg-[var(--primary-foreground)] px-4 py-1 transition-all duration-300 hidden ",
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
              channelId={channel.username} 
              username={channel.username}
              imageUrl={channel.avatar || ""}
              detail={channel.profile?.description?.substring(0, 20) || ''}
              isLive={channel.livestream?.status === 'live' || false}
              viewCount={channel.livestream?.view_count || 0}
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

export default memo(SideBar);
