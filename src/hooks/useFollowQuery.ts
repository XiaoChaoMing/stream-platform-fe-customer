import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followService } from '@/services/app/follow';
import { 
  ICreateSubscriptionRequest,
  IEnrichedSubscription,
} from '@/types/app/IFollow.type';
import { useStore } from '@/store/useStore';
import { useFollowStore } from '@/store/slices/followSlice';

/**
 * Hook for managing subscription-related queries and mutations
 */
export const useFollowQuery = (channelId?: number) => {
  const queryClient = useQueryClient();
  const { user } = useStore();
  const { 
    followerCount, 
    setFollowerCount,
    followersPage,
    followingPage,
    followersLimit,
    followingLimit,
    incrementFollowersPage,
    incrementFollowingPage,
  } = useFollowStore();

  /**
   * Check if current user is subscribed to the channel
   */
  const {
    data: subscriptionStatus,
    isLoading: isCheckingSubscription,
    refetch: refetchSubscriptionStatus
  } = useQuery({
    queryKey: ['subscriptions', 'check', user?.user_id, channelId],
    queryFn: () => user?.user_id && channelId 
      ? followService.checkSubscription(Number(user.user_id), Number(channelId))
      : Promise.resolve({ isSubscribed: false }),
    enabled: !!user?.user_id && !!channelId,
  });

  /**
   * Get channels the user is subscribed to (following)
   */
  const {
    data: following,
    isLoading: isLoadingFollowing,
    refetch: refetchFollowing
  } = useQuery<IEnrichedSubscription[]>({
    queryKey: ['subscriptions', 'following', user?.user_id, followingPage, followingLimit],
    queryFn: () => user?.user_id 
      ? followService.getSubscribedChannels(Number(user.user_id))
      : Promise.resolve([]),
    enabled: !!user?.user_id,
  });

  /**
   * Get subscribers of the channel (followers)
   */
  const {
    data: followers,
    isLoading: isLoadingFollowers,
    refetch: refetchFollowers
  } = useQuery<IEnrichedSubscription[]>({
    queryKey: ['subscriptions', 'followers', channelId, followersPage, followersLimit],
    queryFn: () => channelId 
      ? followService.getChannelSubscribers(Number(channelId))
      : Promise.resolve([]),
    enabled: !!channelId,
  });

  /**
   * Get subscriber count for the channel
   */
  const {
    data: subscriberCount,
    isLoading: isLoadingSubscriberCount,
    refetch: refetchSubscriberCount
  } = useQuery({
    queryKey: ['subscriptions', 'count', channelId],
    queryFn: () => channelId 
      ? followService.getSubscriberCount(Number(channelId))
      : Promise.resolve(0),
    enabled: !!channelId,
  });

  // Update follower count when it changes
  if (subscriberCount !== undefined && subscriberCount !== followerCount) {
    setFollowerCount(subscriberCount);
  }

  /**
   * Subscribe to channel mutation
   */
  const {
    mutate: subscribe,
    isPending: isSubscribing
  } = useMutation({
    mutationFn: (data: ICreateSubscriptionRequest) => 
      followService.subscribe(data),
    onSuccess: () => {
      // Invalidate relevant queries
      if (user?.user_id && channelId) {
        queryClient.invalidateQueries({ 
          queryKey: ['subscriptions', 'check', user.user_id, channelId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['subscriptions', 'following', user.user_id] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['subscriptions', 'followers', channelId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['subscriptions', 'count', channelId] 
        });
      }
    }
  });

  /**
   * Unsubscribe from channel mutation
   */
  const {
    mutate: unsubscribe,
    isPending: isUnsubscribing
  } = useMutation({
    mutationFn: (data: ICreateSubscriptionRequest) => 
      followService.unsubscribe(data),
    onSuccess: () => {
      // Invalidate relevant queries
      if (user?.user_id && channelId) {
        queryClient.invalidateQueries({ 
          queryKey: ['subscriptions', 'check', user.user_id, channelId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['subscriptions', 'following', user.user_id] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['subscriptions', 'followers', channelId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['subscriptions', 'count', channelId] 
        });
      }
    }
  });

  /**
   * Load more followers
   */
  const loadMoreFollowers = () => {
    incrementFollowersPage();
  };

  /**
   * Load more following
   */
  const loadMoreFollowing = () => {
    incrementFollowingPage();
  };

  return {
    // Subscription status
    isSubscribed: subscriptionStatus?.isSubscribed || false,
    isCheckingSubscription,
    
    // Followers data
    followers,
    isLoadingFollowers,
    followerCount: subscriberCount || followerCount,
    isLoadingSubscriberCount,
    
    // Following data
    following,
    isLoadingFollowing,
    
    // Actions
    subscribe,
    isSubscribing,
    unsubscribe,
    isUnsubscribing,
    loadMoreFollowers,
    loadMoreFollowing,
    
    // Refetch functions
    refetchSubscriptionStatus,
    refetchFollowers,
    refetchFollowing,
    refetchSubscriberCount
  };
}; 