import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { channelService } from '@/services/app/channel';
import { useChannelStore } from '@/store/slices/channelSlice';
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { IPaginationParams } from './useVideoQuery';

export const useChannelQuery = (username?: string, paginationParams?: IPaginationParams) => {
  const { user: currentUser } = useStore();
  const { limit, page } = paginationParams || {};
  
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

  // Get channel videos with pagination support
  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ['channelVideos', data?.id, limit, page],
    queryFn: async () => {
      const videos = await channelService.getChannelVideos(data?.id || '', limit, page);
      return videos;
    },
    enabled: !!data?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    setLoading(isLoading);
    
    if (error) {
      setError((error as Error).message);
    }
    
    if (data) {
      // Create IChannelDetailed from data
      const detailedChannel = {
        ...data,
        displayName: data.profile?.name || data.username,
        profileImage: data.avatar || '',
        bannerImage: data.profile?.banner_url || '',
        followers: '0',
        isPartner: false, 
        isAffiliate: false,
        socialLinks: data.profile?.social_links || {},
        panels: [],
        videos: videos || [],
        schedule: {
          days: [],
          startTime: '',
          endTime: '',
          timezone: ''
        },
        category: '',
        createdAt: '',
        updatedAt: ''
      };
      setChannel(detailedChannel);
      
      // Check if the user is viewing their own channel
      setIsOwnChannel(
        !!currentUser && 
        username?.toLowerCase() === currentUser.username?.toLowerCase()
      );
    }
    
    // Clean up when the component unmounts or username changes
    return () => {
      resetState();
    };
  }, [data, videos, isLoading, error, username, currentUser, setChannel, setLoading, setError, resetState, setIsOwnChannel]);

  // Re-check own channel status when user changes
  useEffect(() => {
    if (data && currentUser) {
      setIsOwnChannel(
        username?.toLowerCase() === currentUser.username?.toLowerCase()
      );
    }
  }, [currentUser, username, setIsOwnChannel, data]);

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