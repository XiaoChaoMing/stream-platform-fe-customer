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

interface Channel {
  channelId: string;
  username: string;
  imageUrl: string;
  detail: string;
  isLive: boolean;
  viewCount: number;
}

// Mock data for demonstration
export const mockChannels: Channel[] = [
  {
    channelId: "tech-stream",
    username: "TechStream",
    imageUrl: "https://github.com/shadcn.png",
    detail: "Tech & Programming",
    isLive: true,
    viewCount: 11900
  },
  {
    channelId: "gaming-pro",
    username: "GamingPro",
    imageUrl: "https://github.com/shadcn.png",
    detail: "Gaming & Entertainment",
    isLive: true,
    viewCount: 8500
  },
  {
    channelId: "artistic-flow",
    username: "ArtisticFlow",
    imageUrl: "https://github.com/shadcn.png",
    detail: "Art & Design",
    isLive: false,
    viewCount: 0
  }
];

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        {mockChannels.map((channel) => (
          <ChannelCard
            key={channel.channelId}
            isCollapsed={isCollapsed}
            {...channel}
          />
        ))}
      </div>
    </div>
  );
};

SideBar.propTypes = {};

export default SideBar;
