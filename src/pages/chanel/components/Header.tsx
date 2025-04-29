import { NavLink, useParams } from "react-router-dom";
import { useChannelStore } from "@/store/slices/channelSlice";
import { Button } from "@/components/ui/button";
import { Bell, Radio, Settings, Share2 } from "lucide-react";
import { useChannelQuery } from "@/hooks/useChannelQuery";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { username } = useParams<{ username: string }>();
  const { t } = useTranslation();
  
  // Use React Query hook to fetch channel data
  const { 
    data: channelData, 
    isLoading, 
    followChannel, 
    unfollowChannel,
    isFollowingLoading
  } = useChannelQuery(username);
  
  // Get UI state from Zustand store
  const { 
    isFollowing,
    toggleFollow,
    isOwnChannel
  } = useChannelStore();

  // Handle follow/unfollow actions
  const handleFollowToggle = () => {
    if (isFollowingLoading) return;
    
    // Toggle state in Zustand store
    toggleFollow();
    
    // Call API via React Query mutation
    if (isFollowing) {
      unfollowChannel(channelData?.id || '');
    } else {
      followChannel(channelData?.id || '');
    }
  };

  const baseUrl = `/channel/${username}`;
  
  // Define navigation items for the channel
  const navItems = [
    { label: t('channel.home'), path: "" },
    { label: t('channel.about'), path: "/about" },
    { label: t('channel.videos'), path: "/videos" },
    { label: t('channel.schedule'), path: "/schedule" },
  ];

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="h-48 bg-secondary animate-pulse rounded-md"></div>
        <div className="h-16 bg-secondary animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Channel banner */}
      <div className="relative mb-20">
        {/* Profile section positioned over banner */}
        <div className="absolute -bottom-14 left-0 right-0 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            {/* Left side: Profile image and info */}
            <div className="flex items-end">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background bg-secondary shadow-lg">
                <img 
                  src={channelData?.profileImage || channelData?.avatar} 
                  alt={channelData?.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="ml-4 mb-1">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">{channelData?.displayName}</h1>
                <p className="text-muted-foreground text-sm">{channelData?.followers} {t('channel.followers')}</p>
              </div>
            </div>
            
            {/* Right side: Action buttons */}
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              {/* Follow button */}
              {!isOwnChannel && (
                <div className="flex items-center gap-2">
                  <Button 
                    className={`px-6 py-2 rounded-md ${isFollowing 
                      ? 'bg-secondary hover:bg-secondary/90 text-foreground' 
                      : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                    onClick={handleFollowToggle}
                    disabled={isFollowingLoading}
                  >
                    {isFollowing ? t('Unfollow') : t('Follow')}
                  </Button>
                  
                  {/* Bell notification */}
                  <Button 
                    variant="ghost" 
                    className="w-10 h-10 p-0 rounded-full bg-secondary hover:bg-secondary/90"
                    title={t('channel.notifications')}
                  >
                    <Bell className="h-4 w-4 text-foreground" />
                  </Button>
                  
                  {/* Share button */}
                  <Button 
                    variant="ghost" 
                    className="w-10 h-10 p-0 rounded-full bg-secondary hover:bg-secondary/90"
                    title={t('channel.share')}
                  >
                    <Share2 className="h-4 w-4 text-foreground" />
                  </Button>
                </div>
              )}
              
              {/* Settings button (only for channel owner) */}
              {isOwnChannel && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    className="ml-2 bg-purple-500 hover:bg-purple-600 text-white"
                    title={t('channel.goLive')}
                  >
                    <Radio className="h-4 w-4 mr-2" />
                    {t('channel.goLive')}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="ml-2 bg-secondary hover:bg-secondary/90 text-foreground"
                    title={t('channel.settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t('channel.settings')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation bar */}
      <div className="flex items-center border-b border-border pb-1 mt-4">
        {navItems.map(item => (
          <NavLink
            key={item.label}
            to={baseUrl + item.path}
            end={item.path === ""}
            className={({ isActive }) => 
              `px-5 py-2 text-muted-foreground hover:text-foreground font-medium rounded-t-md transition-colors ${
                isActive 
                  ? "bg-purple-500 text-white border-b-2 border-accent" 
                  : "hover:bg-secondary/50"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Header;
