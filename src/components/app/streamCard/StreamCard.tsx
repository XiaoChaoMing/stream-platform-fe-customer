import streamThumbnail from "@/assets/live_user_iitztimmy-440x248.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import i18n from "@/config/i18Config";
import { IChannel } from "@/types/app/Ichannel.type";
import randomColor from "randomcolor";

type StreamCardProps = {
  thumbImg: string;
  state: boolean;
  view: number;
  channel: IChannel;
  streamName: string;
  tag: string[];
  category: string;
};

const StreamCard = ({
  thumbImg,
  state,
  view,
  channel,
  streamName,
  tag,
  category
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
    <div className="flex w-full flex-col gap-4">
      <div
        className={`group relative w-full bg-[${bgColor}]`}
        style={{ backgroundColor: bgColor }}
      >
        <div className="h-full w-full transition-all duration-300 group-hover:translate-x-[10px] group-hover:translate-y-[-10px]">
          {state && (
            <h1 className="absolute top-1 left-2 rounded-sm bg-red-600 px-1.5 text-white">
              {i18n.t("LIVE")}
            </h1>
          )}
          <h1 className="absolute bottom-1 left-2 rounded-sm bg-[#000000a1] px-1.5 text-white">
            {formatViewCount(view)} {view === 1 ? "viewer" : "viewers"}
          </h1>
          <img
            src={thumbImg || streamThumbnail}
            className="object-cover"
            alt={streamName}
          />
        </div>
      </div>
      <div className="flex flex-row gap-2">
        {/* stream avatar */}
        <Avatar className="size-9 cursor-pointer">
          <AvatarImage src={channel.avatar} alt={channel.name} />
          <AvatarFallback>
            {channel.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* stream info */}
        <div className="flex flex-col items-start gap-1">
          <a
            href="#"
            className="text-md font-medium hover:text-[var(--chart-4)]"
          >
            {streamName}
          </a>
          <a href="#">{channel.name}</a>
          <a href="#" className="hover:text-[var(--chart-4)]">
            {category}
          </a>
          <div className="flex flex-wrap gap-1.5">
            {tag.slice(0, 2).map((tagItem, index) => (
              <p
                key={index}
                className="flex items-center rounded-2xl bg-[var(--ring)] px-2 hover:opacity-90"
              >
                {tagItem}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
