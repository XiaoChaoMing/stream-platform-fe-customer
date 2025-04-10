import { mockChannels } from "@/components/app/sidebar/SideBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function ChannelList() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Popular Channels</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mockChannels.map((channel) => (
          <div
            key={channel.channelId}
            className="hover:bg-muted flex cursor-pointer flex-col items-center gap-4 rounded-lg border p-6"
            onClick={() => navigate(`/channel/${channel.channelId}`)}
          >
            <Avatar className="h-24 w-24">
              <AvatarImage src={channel.imageUrl} alt={channel.username} />
              <AvatarFallback>
                {channel.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{channel.username}</h2>
              <p className="text-muted-foreground text-sm">{channel.detail}</p>
            </div>
            {channel.isLive && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-400"></div>
                <span className="text-muted-foreground text-sm">
                  {channel.viewCount.toLocaleString()} viewers
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
