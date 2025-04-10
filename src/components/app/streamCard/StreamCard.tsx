import streamThumbnail from "@/assets/live_user_iitztimmy-440x248.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import i18n from "@/config/i18Config";
import { IChannel } from "@/types/app/Ichannel.type";

const getRandomBackground = () => {
  const colors = [
    "bg-purple-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-pink-400",
    "bg-indigo-400",
    "bg-teal-400",
    "bg-orange-400"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

type StreamCardProps = {
  thumbImg: string;
  state: boolean;
  view: number;
  channel: IChannel;
  streamName: string;
  tag: string[];
  category: string;
};

const StreamCard = ({ ...props }: StreamCardProps) => {
  const bgColor = getRandomBackground();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className={`group relative w-full ${bgColor}`}>
        <div className="h-full w-full transition-all duration-300 group-hover:translate-x-[10px] group-hover:translate-y-[-10px]">
          <h1 className="absolute top-1 left-2 rounded-sm bg-red-600 px-1.5 text-white">
            {i18n.t("LIVE")}
          </h1>
          <h1 className="absolute bottom-1 left-2 rounded-sm bg-[#000000a1] px-1.5 text-white">
            100k viewer
          </h1>
          <img src={streamThumbnail} className="object-cover" alt="" />
        </div>
      </div>
      <div className="flex flex-row gap-2">
        {/* stream avatar */}
        <Avatar className="size-13 cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {/* stream info */}
        <div className="flex flex-col items-start gap-1">
          <a
            href="#"
            className="text-xl font-medium hover:text-[var(--chart-4)]"
          >
            Stream name
          </a>
          <a href="#">Channel name</a>
          <a href="#" className="hover:text-[var(--chart-4)]">
            {" "}
            Valorant
          </a>
          <div className="flex flex-wrap gap-1.5">
            <p className="flex items-center rounded-2xl bg-[var(--ring)] px-2 hover:opacity-90">
              Game
            </p>
            <p className="flex items-center rounded-2xl bg-[var(--ring)] px-2 hover:opacity-90">
              English
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
