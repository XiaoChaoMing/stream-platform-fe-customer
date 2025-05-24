import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import LogoBlack from "@/assets/logo-black.png";
import LogoWhite from "@/assets/logo-white.png";
import { SocketStatus } from "@/components/base/SocketStatus";
import { Link, useNavigate } from "react-router-dom";
import { PATH } from "@/constants/path";
import {
  Crown,
  EllipsisVertical,
  Inbox,
  MessageSquare,
  Search,
  Sun,
  Moon,
  Menu,
  RefreshCw,
  User,
  LogOut,
  CreditCard,
} from "lucide-react";
import { memo, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationDropdown from "../notification/NotificationDropdown";
import { useNotificationStore } from "@/store/notificationStore";
import { useNotificationQuery } from "@/hooks/useNotificationQuery";
import { PaymentModal } from "@/components/app/payment/PaymentModal";

// Memoize the component to prevent unnecessary re-renders
const Header = memo(() => {
  const { theme, toggleTheme, user, setUser, logout } = useStore();
  const navigate = useNavigate();
  // Store avatar as separate state with a timestamp to force re-rendering
  const [avatarState, setAvatarState] = useState({
    url: user?.avatar,
    timestamp: Date.now() // Add timestamp to force re-render
  });
  
  // Get notification data
  const { unreadCount } = useNotificationStore();
  // Initialize notification data
  useNotificationQuery({ limit: 5 });
  
  // Force update component when user changes
  useEffect(() => {
    if (user?.avatar !== avatarState.url) {
      setAvatarState({
        url: user?.avatar,
        timestamp: Date.now() // Update timestamp to force re-render
      });
    }
  }, [user, avatarState.url]);
  
  // Also listen for custom app-storage-update events
  useEffect(() => {
    const handleCustomStorageUpdate = (event: any) => {
      if (event.detail && event.detail.user && event.detail.user.avatar) {
        
        // Force re-render with new avatar
        setAvatarState({
          url: event.detail.user.avatar,
          timestamp: Date.now()
        });
      }
    };
    
    // Add event listener for our custom storage update event
    window.addEventListener('app-storage-update', handleCustomStorageUpdate);
    
    return () => {
      window.removeEventListener('app-storage-update', handleCustomStorageUpdate);
    };
  }, []);
  
  // Also listen for storage events directly in this component
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedData = localStorage.getItem('app-storage');
        if (storedData) {
          const data = JSON.parse(storedData);
          // Only update avatar state if avatar has actually changed
          // AND compare as strings to avoid reference issues
          if (data.state?.user?.avatar && 
              data.state.user.avatar !== avatarState.url && 
              JSON.stringify(data.state.theme) !== JSON.stringify(theme)) {
            setAvatarState({
              url: data.state.user.avatar,
              timestamp: Date.now()
            });
          }
        }
      } catch (err) {
        console.error("Error processing storage event in header:", err);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [avatarState.url, theme]);

  const handleNavigateToUserChannel = () => {
    if (user?.username) {
      navigate(`/channel/${user.username}`);
    }
  };

  // Utility function to force refresh avatar from localStorage
  const forceRefreshFromLocalStorage = () => {
    try {
      const storedData = localStorage.getItem('app-storage');
      if (storedData) {
        const data = JSON.parse(storedData);
        if (data.state?.user?.avatar) {
          
          // Only update if avatar has actually changed
          if (data.state.user.avatar !== user?.avatar) {
            // Update both the store and local state
            if (user) {
              const updatedUser = { ...user, avatar: data.state.user.avatar };
              setUser(updatedUser);
            }
            
            // Force component re-render
            setAvatarState({
              url: data.state.user.avatar,
              timestamp: Date.now()
            });
          }
        } else {
          console.log("No avatar found in localStorage");
        }
      }
    } catch (err) {
      console.error("Error refreshing avatar from localStorage:", err);
    }
  };

  // Ensure avatar fallback text is updated correctly
  const getAvatarFallback = () => {
    if (!user?.username) return "?";
    return user.username.charAt(0).toUpperCase();
  };

  // Add random key to AvatarImage to force it to re-render with new src
  const avatarKey = `avatar-${avatarState.timestamp}`;

  // Handle logout
  const handleLogout = () => {
    if (logout) {
      logout();
      navigate(PATH.LOGIN);
    }
  };

  // Notification trigger element
  const notificationTrigger = (
    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md relative">
      <Inbox className="hover:text-primary cursor-pointer" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Button>
  );

  // Payment button for the modal
  const paymentButton = (
    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
      <CreditCard className="hover:text-primary cursor-pointer" />
    </Button>
  );

  return (
    <div className="fixed z-99 mb-1 flex h-fit w-full items-center justify-between bg-[var(--primary-foreground)] px-4 py-2.5">
      <div className="flex items-center justify-center gap-3">
        <div className="w-32">
          <Link to={PATH.HOME} >
            <img
              style={{ "--c": theme === "light" ? "#000" : "#fff" } as React.CSSProperties}
              src={theme === "light" ? LogoBlack : LogoWhite}
              alt="logo"
              className="h-full w-full object-contain hover-2"
            />
          </Link>
        </div>
        <div className="sm:flex items-center justify-center gap-2 hidden mt-1">
        <Link
          to={PATH.FOLLOWING}
          className="text-md ml-4 font-medium transition-all duration-300 hover:text-[var(--color-chart-4)]"
        >
          Following
        </Link>
        <Link
          to={PATH.HOME}
          className="text-md ml-4 font-medium transition-all duration-300 hover:text-[var(--color-chart-4)]"
        >
          Browse
        </Link>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <EllipsisVertical />
        </Button>
        </div>
      </div>
      <div className="hidden sm:flex items-center justify-center gap-2">
        <Input className="min-w-xl" placeholder="Search..." />
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <Search />
        </Button>
      </div>
      <div className="hidden sm:flex items-center justify-center gap-3">
        <div className="relative">
          <SocketStatus />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-md"
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </Button>
        {process.env.NODE_ENV === 'development' && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={forceRefreshFromLocalStorage}
            className="h-9 w-9 rounded-md"
            title="Force refresh avatar"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
        
        {/* Payment Modal */}
        <PaymentModal triggerButton={paymentButton} />
        
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <MessageSquare className="hover:text-primary cursor-pointer" />
        </Button>
        
        {/* Notifications Dropdown */}
        <NotificationDropdown trigger={notificationTrigger} />
        
        <Avatar className="cursor-pointer" onClick={handleNavigateToUserChannel}>
          <AvatarImage key={avatarKey} src={avatarState.url} alt={`${user?.username}'s avatar`} />
          <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
        </Avatar>
      </div>
      
      {/* Mobile menu using dropdown */}
      <div className="flex items-center justify-center gap-3 sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage key={avatarKey} src={avatarState.url} alt={`${user?.username}'s avatar`} />
                  <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                </Avatar>
                <span>{user?.username || 'User'}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Search for mobile */}
            <div className="px-2 py-1.5">
              <div className="flex items-center gap-2 rounded-md border px-3 py-1">
                <Search className="h-4 w-4 opacity-50" />
                <Input 
                  className="h-8 w-full border-0 bg-transparent p-0 focus-visible:ring-0" 
                  placeholder="Search..."
                />
              </div>
            </div>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleNavigateToUserChannel}>
                <User className="mr-2 h-4 w-4" />
                <span>My Channel</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={PATH.FOLLOWING} className="flex items-center">
                  <Crown className="mr-2 h-4 w-4" />
                  <span>Following</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={PATH.HOME} className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  <span>Browse</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <PaymentModal 
                  triggerButton={
                    <div className="flex w-full items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Payment</span>
                    </div>
                  } 
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={toggleTheme}>
                {theme === "light" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Messages</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Inbox className="mr-2 h-4 w-4" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});

Header.displayName = "Header";

export default Header;
