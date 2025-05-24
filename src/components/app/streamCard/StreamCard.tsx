import streamThumbnail from "@/assets/live_user_iitztimmy-440x248.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import i18n from "@/config/i18Config";
import { Image } from "@/components/app/image/Image";
import randomColor from "randomcolor";
import { Skeleton } from "@/components/ui/skeleton";

type Variant = "default" | "sm" 

type IChannel = {
  id?: string | number;
  user_id?: number;
  username: string;
  avatar?: string | null;
}

type StreamCardProps = {
  thumbImg?: string | null;
  state?: boolean;
  view?: number;
  channel: IChannel;
  streamName: string;
  variant?: Variant;
  isLoading?: boolean;
};

const StreamCard = ({
  thumbImg,
  state = false,
  view = 0,
  channel,
  streamName,
  variant = "default",
  isLoading = false
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

  if (isLoading) {
    return (
      <div className={`flex w-full ${variant === "sm" ? "flex-row gap-3" : "flex-col gap-2"} transition-all duration-300`}>
        <Skeleton className={`${variant === "sm" ? "w-[170px] h-[90px]" : "w-full aspect-video"}`} />
        <div className="flex flex-row gap-2 flex-1 min-w-0">
          {variant !== "sm" && <Skeleton className="size-9 rounded-full shrink-0" />}
          <div className="flex flex-col items-start gap-1 min-w-0 w-full">
            <Skeleton className={`${variant === "sm" ? "h-4 w-full" : "h-5 w-full"}`} />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full ${variant === "sm" ? "flex-row gap-3" : "flex-col gap-2"} transition-all duration-300`}>
      <div className="hover-group cursor-pointer">
        <div 
          className={`group relative hover-2 overflow-hidden ${variant === "sm" ? "w-[170px] h-[90px] min-w-[120px]" : "w-full aspect-video"}`} 
          style={{ "--c": bgColor, "--d": variant === "sm" ? "5px" : "7px" } as React.CSSProperties}
        >
          {state ?(
            <h1 className={`${variant === "sm" ? "hidden" : "absolute top-1 left-2 rounded-sm bg-red-600 px-1.5 text-white z-10 text-xs md:text-sm"}`}>
              {i18n.t("LIVE")}
            </h1>
          ):(
            <h1 className={`${variant === "sm" ? "hidden" : "absolute top-1 left-2 rounded-sm bg-muted-foreground/20 px-1.5 text-white z-10 text-xs md:text-sm"}`}>
              {i18n.t("Offline")}
            </h1>
          )}
          <h1 className={`${variant === "sm" ? "hidden" : "absolute bottom-1 left-2 rounded-sm bg-background px-1.5 text-white z-10 text-xs md:text-sm"}`}>
            {formatViewCount(view)} {view === 1 ? "viewer" : "viewers"}
          </h1>
          <Image
          src={thumbImg || streamThumbnail} 
          alt={streamName}
          containerClassName="w-full h-full object-cover"
          width={variant === "sm" ? 170 : 440}
          height={variant === "sm" ? 90 : 248}
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
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
