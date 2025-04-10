import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, EllipsisVertical, Heart, Star } from "lucide-react";

const Header = () => {
  return (
    <div className="flex flex-row items-center justify-between">
      {/* channel info */}
      <div className="flex flex-row items-center justify-center gap-2">
        <Avatar className="size-20 cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-medium">Channel Name</h1>
          <p className="text-sm text-gray-500">10m Followers</p>
        </div>
      </div>
      {/* channel interaction */}
      <div className="flex flex-row items-center justify-center gap-2">
        <Button
          variant="default"
          className="group cursor-pointer bg-[var(--chart-4)] text-white hover:bg-[var(--chart-4)]"
        >
          <Heart className="transition-all duration-300 group-hover:scale-125 group-hover:fill-white" />
          Follow
        </Button>
        <Button
          variant="default"
          className="cursor-pointer bg-[var(--muted-foreground)] text-white hover:bg-[var(--muted-foreground)]"
        >
          <Star />
          Subscribe
          <ChevronDown />
        </Button>
        <div className="rounded-md p-2 hover:bg-[var(--secondary)]">
          <EllipsisVertical size={20} />
        </div>
      </div>
    </div>
  );
};

export default Header;
