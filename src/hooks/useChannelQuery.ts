import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { channelService } from '@/services/app/channel';
import { useChannelStore } from '@/store/slices/channelSlice';
import { useEffect } from 'react';

// Mock current user data - In a real app this would come from authentication
const currentUser = {
  username: 'summit1g',
  isLoggedIn: true
};

export const useChannelQuery = (username?: string) => {
  const queryClient = useQueryClient();
  const { 
    setChannel, 
    setLoading, 
    setError, 
    resetState, 
    setIsOwnChannel 
  } = useChannelStore();

  // Fetch channel details
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['channel', username],
    queryFn: () => channelService.getChannelByUsername(username || ''),
    enabled: !!username,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Follow channel mutation
  const followMutation = useMutation({
    mutationFn: (channelId: string) => channelService.followChannel(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel', username] });
    }
  });

  // Unfollow channel mutation
  const unfollowMutation = useMutation({
    mutationFn: (channelId: string) => channelService.unfollowChannel(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel', username] });
    }
  });

  // Get channel videos
  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ['channelVideos', data?.id],
    queryFn: () => channelService.getChannelVideos(data?.id || ''),
    enabled: !!data?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update Zustand store with data from React Query
  useEffect(() => {
    setLoading(isLoading);
    
    if (error) {
      setError((error as Error).message);
    }
    
    if (data) {
      setChannel(data);
      
      // Check if the user is viewing their own channel
      setIsOwnChannel(
        currentUser.isLoggedIn && 
        username?.toLowerCase() === currentUser.username.toLowerCase()
      );
    }
    
    // Clean up when the component unmounts or username changes
    return () => {
      resetState();
    };
  }, [data, isLoading, error, username, setChannel, setLoading, setError, resetState, setIsOwnChannel]);

  return {
    data,
    videos,
    isLoading,
    videosLoading,
    error,
    refetch,
    followChannel: (channelId: string) => followMutation.mutate(channelId),
    unfollowChannel: (channelId: string) => unfollowMutation.mutate(channelId),
    isFollowingLoading: followMutation.isPending || unfollowMutation.isPending
  };
}; 