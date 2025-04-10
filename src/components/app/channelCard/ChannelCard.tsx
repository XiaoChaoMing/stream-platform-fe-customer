import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface ChannelCardProps {
  isCollapsed: boolean;
  username: string;
  imageUrl: string;
  detail: string;
  isLive?: boolean;
  viewCount?: number;
  channelId: string;
}

const ChannelCard = ({
  isCollapsed,
  username,
  imageUrl,
  detail,
  isLive = false,
  viewCount = 0,
  channelId
}: ChannelCardProps) => {
  const navigate = useNavigate();

  const handleChannelClick = () => {
    navigate(`/channel/${channelId}`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={handleChannelClick}
            className="flex cursor-pointer flex-row justify-between gap-2 rounded-md p-2 hover:bg-[var(--muted)]"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <Avatar className="size-10">
                <AvatarImage src={imageUrl} alt={username} />
                <AvatarFallback>
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col items-start justify-center">
                  <h1 className="font-medium">{username}</h1>
                  <h1 className="w-36 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--muted-foreground)]">
                    {detail}
                  </h1>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex flex-row items-center justify-center gap-2">
                {isLive && (
                  <div className="h-2 w-2 rounded-full bg-red-400"></div>
                )}
                {viewCount > 0 && <div>{viewCount.toLocaleString()}</div>}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{username}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChannelCard;
