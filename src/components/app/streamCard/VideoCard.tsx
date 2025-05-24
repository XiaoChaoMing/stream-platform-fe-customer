import randomColor from "randomcolor";
import defaultThumbnail from "@/assets/default_video.webp";
import { Image } from "@/components/app/image/Image";
import { formatDistanceToNow } from "date-fns";
import { formatDurationCompact, formatViewCount } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Variant = "default" | "sm";

interface VideoData {
  video_id: string | number;
  thumbnailUrl: string;
  title: string;
  duration: string | number;
  username: string;
  views: number;
  createdAt: string;
}

type VideoCardProps = {
  video: VideoData;
  onClick?: () => void;
  variant?: Variant;
  isLoading?: boolean;
};

const VideoCard = ({
  video,
  onClick,
  variant = "default",
  isLoading = false
}: VideoCardProps) => {
  const bgColor = randomColor();

  if (isLoading) {
    return (
      <div className={`bg-card overflow-hidden ${variant === "sm" ? "flex flex-row gap-3" : ""}`}>
        <Skeleton className={`${variant === "sm" ? "w-[170px] h-[90px]" : "w-full aspect-video"}`} />
        <div className={`${variant === "sm" ? "flex-1 py-1" : "p-3"}`}>
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-1/2 mt-2" />
            <div className="mt-2 flex items-center gap-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      key={video.video_id}
      className={`bg-card overflow-hidden cursor-pointer ${variant === "sm" ? "flex flex-row gap-3" : ""}`}
      onClick={onClick}
    >
      <div 
        className={`relative hover-2 ${variant === "sm" ? "w-[170px] h-[90px] min-w-[120px]" : "w-full aspect-video"}`} 
        style={{ "--c": bgColor, "--d": variant === "sm" ? "5px" : "7px" } as React.CSSProperties}
      >
        <Image
          src={video.thumbnailUrl || defaultThumbnail} 
          alt={video.title}
          containerClassName="w-full h-full object-cover"
          width={variant === "sm" ? 170 : 440}
          height={variant === "sm" ? 90 : 248}
        />
        <div className="sm:absolute bottom-2 right-2 bg-secondary/80 text-secondary-foreground px-1 rounded text-xs py-0.5">
          {formatDurationCompact(parseInt(video.duration as string))}
        </div>
      </div>
      
      <div className={`${variant === "sm" ? "flex-1 py-1" : "p-3"}`}>
      <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors text-start">
                {video.title}
              </h4>
              
              <div className="mt-1 flex items-center text-xs text-neutral-400">
                <span>{video.username}</span>
              </div>
              
              <div className="mt-1 flex items-center text-xs text-neutral-400">
                <span>{formatViewCount(video.views)} views</span>
                <span className="mx-1">•</span>
                <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
      </div>
    </div>
  );
};

export default VideoCard;
