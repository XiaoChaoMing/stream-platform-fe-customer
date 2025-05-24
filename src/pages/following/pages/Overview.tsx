
import { useFollowQuery } from "@/hooks/useFollowQuery";
import { FollowingCard } from "../components/FollowingCard";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Overview = () => {
  const { t } = useTranslation();
  
  const {
    following,
    isLoadingFollowing,
    unsubscribe,
    isUnsubscribing,
    loadMoreFollowing
  } = useFollowQuery();
  
  const handleUnfollow = (unfollowData: { subscriber_id: number, subscribed_to_id: number }) => {
    unsubscribe(unfollowData);
  };
  
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t('My Subscriptions')}</h2>
      
      <div className="mb-8">
        <div>
          {isLoadingFollowing ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : following && following.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {following.map((subscription) => (
                  <FollowingCard
                    key={subscription.subscription_id}
                    followedUser={subscription}
                    onUnfollow={handleUnfollow}
                    isUnfollowing={isUnsubscribing}
                  />
                ))}
              </div>
              
              {following.length >= 10 && (
                <div className="flex justify-center mt-8">
                  <Button 
                    variant="outline" 
                    onClick={loadMoreFollowing}
                  >
                    {t('Load More')}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{t('Not Following Anyone Yet')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('When you follow channels, they will appear here.')}
              </p>
              <Button variant="default">
                {t('Discover Channels')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;