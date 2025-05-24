import { NavLink, useParams } from "react-router-dom";
import { useChannelStore } from "@/store/slices/channelSlice";
import { Button } from "@/components/ui/button";
import { Bell, Share2 } from "lucide-react";
import { useChannelQuery } from "@/hooks/useChannelQuery";
import { useTranslation } from "react-i18next";
import { memo, useEffect } from "react";
import blankAvt from "@/assets/blank-avt.avif";
import { EditModal } from "./EditModal";
import { useStore } from "@/store/useStore";
import { GoLiveModal } from "./GoLiveModal";
import { EndLiveDialog } from "./EndLiveDialog";
import { useChannelFollow } from "@/hooks/useChannelFollow";
import { useLivestreamByUserQuery } from "@/hooks/useLivestreamQuery";
import { CreateLivestreamModal } from "./CreateLivestreamModal";
import { Image } from "@/components/app/image/Image";
const Header = memo(() => {
  const { username } = useParams<{ username: string }>();
  const { t } = useTranslation();
  const { user } = useStore();
  
  const baseUrl = `/channel/${username}`;
  
  // Define navigation items for the channel
  const navItems = [
    { label: t('home'), path: "" },
    { label: t('about'), path: "/about" },
    { label: t('videos'), path: "/videos" },
    { label: t('schedule'), path: "/schedule" },
  ];

  const { 
    data: channelData, 
    isLoading,
    refetch
  } = useChannelQuery(username);

  // Check if user has livestream profile
  const {
    hasActiveLivestream,
    isLoadingUserLivestreams
  } = useLivestreamByUserQuery(
    channelData?.id ? Number(channelData.id) : undefined
  );

  // Use the new follow functionality
  const {
    isSubscribed,
    followerCount,
    isLoading: isFollowLoading,
    toggleSubscription
  } = useChannelFollow(
    channelData?.id ? Number(channelData.id) : undefined
  );
  
  const { isOwnChannel } = useChannelStore();

  useEffect(() => {
    if (isOwnChannel && user) {
      refetch();
    }
  }, [user, isOwnChannel, refetch]);

  if (isLoading || isLoadingUserLivestreams) {
    return (
      <div className="w-full space-y-4">
        <div className="h-48 bg-secondary animate-pulse rounded-md"></div>
        <div className="h-16 bg-secondary animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-fit">
      {/* Channel banner */}
      <div className="relative sm:mb-20 mb-10">
        {/* Profile section positioned over banner */}
        <div className="sm:absolute -bottom-14 left-0 right-0 px-4 block">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            {/* Left side: Profile image and info */}
            <div className="flex items-end">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-muted bg-transparent shadow-lg">
                <Image
                  src={channelData?.avatar || blankAvt}
                  alt={channelData?.displayName}
                  containerClassName="w-full h-full object-cover"
                />
              </div>
              
              <div className="ml-4 mb-1">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">{channelData?.displayName}</h1>
                <p className="text-muted-foreground text-sm text-start">{followerCount || channelData?.followers_count || 0} {t('followers')}</p>
              </div>
            </div>
            
            {/* Right side: Action buttons */}
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              {/* Follow button */}
              {!isOwnChannel && (
                <div className="flex items-center gap-2">
                  <Button 
                    className={`px-6 py-2 rounded-md ${isSubscribed 
                      ? 'bg-secondary hover:bg-secondary/90 text-foreground' 
                      : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                    onClick={toggleSubscription}
                    disabled={isFollowLoading}
                  >
                    {isSubscribed ? t('Unfollow') : t('Follow')}
                  </Button>
                  
                  {/* Bell notification */}
                  <Button 
                    variant="ghost" 
                    className="w-10 h-10 p-0 rounded-full bg-secondary hover:bg-secondary/90"
                    title={t('notifications')}
                  >
                    <Bell className="h-4 w-4 text-foreground" />
                  </Button>
                  
                  {/* Share button */}
                  <Button 
                    variant="ghost" 
                    className="w-10 h-10 p-0 rounded-full bg-secondary hover:bg-secondary/90"
                    title={t('share')}
                  >
                    <Share2 className="h-4 w-4 text-foreground" />
                  </Button>
                </div>
              )}
              
              {/* Settings button (only for channel owner) */}
              {isOwnChannel && (
                <div className="flex items-center gap-2">
                  {!channelData?.livestream || channelData.livestream.status !== 'live' ? (
                    hasActiveLivestream ? (
                      <GoLiveModal streamId={channelData?.livestream?.stream_id.toString() || "999"}/>
                    ) : (
                      <CreateLivestreamModal userId={Number(channelData?.id)} onSuccess={refetch} />
                    )
                  ) : (
                    <EndLiveDialog 
                      streamData={{
                        id: channelData.livestream.stream_id.toString(),
                        title: channelData.livestream.title,
                        description: channelData.livestream.description,
                        stream_url: channelData.livestream.stream_url
                      }} 
                    />
                  )}
                  <EditModal profileId={channelData?.id || ''} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation bar */}
      <div className="sm:flex block items-center border-b border-border pb-1 sm:mt-4 mt-0 overflow-x-auto">
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
});

Header.displayName = "Header";

export default Header;
