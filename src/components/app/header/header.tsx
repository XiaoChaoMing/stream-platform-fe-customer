import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import LogoBlack from "@/assets/logo-black.png";
import LogoWhite from "@/assets/logo-white.png";
import {
  Crown,
  EllipsisVertical,
  Inbox,
  MessageSquare,
  Search,
  Sun,
  Moon
} from "lucide-react";

const Header = () => {
  const { theme, toggleTheme } = useStore();

  return (
    <div className="fixed z-99 mb-1 flex h-fit w-full items-center justify-between bg-[var(--primary-foreground)] px-4 py-2.5">
      <div className="flex items-center justify-center gap-3">
        <div className="w-32">
          <img
            src={theme === "light" ? LogoBlack : LogoWhite}
            alt="logo"
            className="h-full w-full object-contain"
          />
        </div>
        <a
          href="#"
          className="text-md ml-4 font-medium transition-all duration-300 hover:text-[var(--color-chart-4)]"
        >
          Following
        </a>
        <a
          href="#"
          className="text-md ml-4 font-medium transition-all duration-300 hover:text-[var(--color-chart-4)]"
        >
          Browse
        </a>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <EllipsisVertical />
        </Button>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Input className="min-w-xl" placeholder="Search..." />
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <Search />
        </Button>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-md"
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <Crown className="hover:text-primary cursor-pointer" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <MessageSquare className="hover:text-primary cursor-pointer" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <Inbox className="hover:text-primary cursor-pointer" />
        </Button>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
