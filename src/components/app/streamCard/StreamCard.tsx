import streamThumbnail from "@/assets/live_user_iitztimmy-440x248.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import i18n from "@/config/i18Config";
import { IChannel } from "@/types/app/Ichannel.type";
import randomColor from "randomcolor";

type Variant = "default" | "sm" 

type StreamCardProps = {
  thumbImg: string;
  state: boolean;
  view: number;
  channel: IChannel;
  streamName: string;
  tag: string[];
  category: string;
  variant?: Variant;
};

const StreamCard = ({
  thumbImg,
  state,
  view,
  channel,
  streamName,
  tag,
  category,
  variant = "default"
}: StreamCardProps) => {
  const bgColor = randomColor();
  // Format view count for display
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return (
    <div className={`flex w-full ${variant === "sm" ? "flex-row gap-3" : "flex-col gap-2"} transition-all duration-300`}>
      <div className="hover-group cursor-pointer">
        <div 
          className={`group relative hover-2 overflow-hidden ${variant === "sm" ? "w-[170px] h-[90px] min-w-[120px]" : "w-full aspect-video"}`} 
          style={{ "--c": bgColor, "--d": variant === "sm" ? "5px" : "7px" } as React.CSSProperties}
        >
          {state && (
            <h1 className={`${variant === "sm" ? "hidden" : "absolute top-1 left-2 rounded-sm bg-red-600 px-1.5 text-white z-10 text-xs md:text-sm"}`}>
              {i18n.t("LIVE")}
            </h1>
          )}
          <h1 className={`${variant === "sm" ? "hidden" : "absolute bottom-1 left-2 rounded-sm bg-[#000000a1] px-1.5 text-white z-10 text-xs md:text-sm"}`}>
            {formatViewCount(view)} {view === 1 ? "viewer" : "viewers"}
          </h1>
          <img
            src={thumbImg || streamThumbnail}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            alt={streamName}
          />
        </div>
      </div>
      
      <div className="flex flex-row gap-2 flex-1 min-w-0">
        {/* stream avatar */}
        <Avatar className={`${variant === "sm" ? "hidden" : "size-9"} cursor-pointer shrink-0`}>
          <AvatarImage src={channel.avatar || ""} alt={channel.username} />
          <AvatarFallback>
            {channel.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* stream info */}
        <div className="flex flex-col items-start gap-0.5 min-w-0 w-full">
          <a
            href="#"
            className={`${variant === "sm" ? "text-sm" : "text-md"} font-medium hover:text-[var(--chart-4)] text-start w-full truncate`}
          >
            {streamName}
          </a>
          <a href="#" className="text-sm text-muted-foreground truncate w-full text-start">{channel.username}</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-[var(--chart-4)] truncate w-full text-start">

            {category}
          </a>
          {variant !== "sm" && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {tag.slice(0, 2).map((tagItem, index) => (
                <p
                  key={index}
                  className="flex items-center text-xs rounded-2xl bg-[var(--ring)] px-2 hover:opacity-90"
                >
                  {tagItem}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
