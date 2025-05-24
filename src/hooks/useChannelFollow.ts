import { useEffect } from 'react';
import { useFollowQuery } from './useFollowQuery';
import { useFollowStore } from '@/store/slices/followSlice';
import { useStore } from '@/store/useStore';

/**
 * A simplified hook that provides all necessary functionality
 * for handling subscriptions to channels (following/unfollowing)
 */
export const useChannelFollow = (channelId?: number) => {
  const { user } = useStore();
  
  // Get follow state and actions from the store
  const { 
    isSubscribed,
    setIsSubscribed,
    followingList,
    followersList,
    followerCount,
    setSelectedChannelId,
    resetState
  } = useFollowStore();
  
  // Use the React Query hook for data fetching
  const {
    isSubscribed: subscriptionStatus,
    isCheckingSubscription,
    followers,
    isLoadingFollowers,
    followerCount: subscriberCount,
    isLoadingSubscriberCount,
    following,
    isLoadingFollowing,
    subscribe,
    isSubscribing,
    unsubscribe,
    isUnsubscribing,
    loadMoreFollowers,
    loadMoreFollowing
  } = useFollowQuery(channelId);
  
  // Update selected channel in store
  useEffect(() => {
    if (channelId) {
      setSelectedChannelId(channelId);
    }
  }, [channelId, setSelectedChannelId]);
  
  // Update local state when subscription status changes
  useEffect(() => {
    setIsSubscribed(subscriptionStatus);
  }, [subscriptionStatus, setIsSubscribed]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);
  
  // Handle subscribe
  const handleSubscribe = () => {
    if (!user?.user_id || !channelId) return;
    
    subscribe({
      subscriber_id: Number(user.user_id),
      subscribed_to_id: Number(channelId)
    });
  };
  
  // Handle unsubscribe
  const handleUnsubscribe = () => {
    if (!user?.user_id || !channelId) return;
    
    unsubscribe({
      subscriber_id:Number(user.user_id),
      subscribed_to_id: Number(channelId)
    });
  };
  
  // Toggle subscription
  const toggleSubscription = () => {
    if (isSubscribed) {
      handleUnsubscribe();
    } else {
      handleSubscribe();
    }
  };
  
  return {
    // State
    isSubscribed,
    followers: followers || followersList,
    following: following || followingList,
    followerCount: subscriberCount || followerCount,
    
    // Loading states
    isLoading: isCheckingSubscription || isSubscribing || isUnsubscribing,
    isLoadingFollowers,
    isLoadingFollowing,
    isLoadingSubscriberCount,
    
    // Actions
    subscribe: handleSubscribe,
    unsubscribe: handleUnsubscribe,
    toggleSubscription,
    loadMoreFollowers,
    loadMoreFollowing
  };
}; 