import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import blankAvt from '@/assets/blank-avt.avif';
import { useTranslation } from 'react-i18next';
import { IEnrichedSubscription, ICreateSubscriptionRequest } from '@/types/app/IFollow.type';
import { isVideoFile } from '@/lib/utils';

interface FollowingCardProps {
  followedUser: IEnrichedSubscription;
  onUnfollow: (data: ICreateSubscriptionRequest) => void;
  isUnfollowing: boolean;
}

export const FollowingCard: FC<FollowingCardProps> = ({ 
  followedUser, 
  onUnfollow,
  isUnfollowing
}) => {
  const { t } = useTranslation();
  
  const handleUnfollow = () => {
    onUnfollow({
      subscriber_id: followedUser.subscriber_id,
      subscribed_to_id: followedUser.subscribed_to_id
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0">
      <div className="h-32 bg-secondary w-full">
        {isVideoFile(followedUser.subscribedTo.profile.banner_url || undefined) ? (
            <video  
            src={followedUser.subscribedTo.profile.banner_url || undefined}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            />
        ) : (
            <img
            src={followedUser.subscribedTo.profile.banner_url || blankAvt}
            alt={followedUser.subscribedTo.profile.name}
            className="w-full h-full object-cover"
            />
        )}
</div>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-start -mt-10 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-background">
            <img 
              src={followedUser.subscribedTo.avatar || blankAvt} 
              alt={followedUser.subscribedTo.profile.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4 mt-6 flex-1">
            <h3 className="text-lg font-semibold truncate">
              {followedUser.subscribedTo.profile.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              @{followedUser.subscribedTo.username}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {followedUser.subscribedTo.profile.description || t('No description available.')}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          <Link to={`/channel/${followedUser.subscribedTo.username}`}>
            <Button variant="secondary" size="sm">
              {t('Visit Channel')}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUnfollow}
            disabled={isUnfollowing}
          >
            {t('Unfollow')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 