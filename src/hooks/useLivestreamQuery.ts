import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { livestreamService } from '@/services/app/livestream';
import { useLivestreamStore } from '@/store/slices/livestreamSlice';
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { ILivestream } from "@/types/app/ILivestream.type";

interface CreateLivestreamDTO {
  title: string;
  description?: string;
  user_id: number;
  thumbnail?: File;
}

/**
 * Hook for managing livestream-related queries
 */
export const useLivestreamQuery = () => {
  const { user } = useStore();
  const { 
    setFollowingLivestreams, 
    setIsLoading,
    setError,
  } = useLivestreamStore();

  /**
   * Get all livestreams
   */
  const {
    data: allLivestreams,
    isLoading: isLoadingAllLivestreams,
    error: allLivestreamsError,
    refetch: refetchAllLivestreams
  } = useQuery({
    queryKey: ['livestreams', 'all'],
    queryFn: () => livestreamService.getAllLivestreams(),
  });

  /**
   * Get livestreams from users the current user is following
   */
  const {
    data: followingLivestreams,
    isLoading: isLoadingFollowingLivestreams,
    error: followingLivestreamsError,
    refetch: refetchFollowingLivestreams
  } = useQuery({
    queryKey: ['livestreams', 'following', user?.user_id],
    queryFn: () => user?.user_id
      ? livestreamService.getLivestreamsByFollowing(Number(user.user_id))
      : Promise.resolve([]),
    enabled: !!user?.user_id,
  });

  // Update store when data changes
  useEffect(() => {
    if (followingLivestreams) {
      setFollowingLivestreams(followingLivestreams);
    }
  }, [followingLivestreams, setFollowingLivestreams]);

  useEffect(() => {
    setIsLoading(isLoadingFollowingLivestreams);
  }, [isLoadingFollowingLivestreams, setIsLoading]);

  useEffect(() => {
    if (followingLivestreamsError) {
      setError((followingLivestreamsError as Error).message);
    } else {
      setError(null);
    }
  }, [followingLivestreamsError, setError]);

  return {
    // All livestreams
    allLivestreams,
    isLoadingAllLivestreams,
    allLivestreamsError,
    refetchAllLivestreams,
    
    // Following livestreams
    followingLivestreams,
    isLoadingFollowingLivestreams,
    followingLivestreamsError,
    refetchFollowingLivestreams
  };
};

/**
 * Hook to fetch livestreams by user ID
 * @param userId - The ID of the user whose livestreams to fetch
 * @returns Object containing livestreams data, loading state, and error state
 */
export const useLivestreamByUserQuery = (userId?: number) => {
  const {
    data: userLivestreams,
    isLoading: isLoadingUserLivestreams,
    error: userLivestreamsError,
    refetch: refetchUserLivestreams,
  } = useQuery<ILivestream[], Error>({
    queryKey: ['livestreams', 'user', userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return livestreamService.getLivestreamsByUserId(userId);
    },
    enabled: !!userId, // Only run query if userId is provided
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    retry: 1, // Only retry once on failure
  });

  // Check if user has any active livestream profile
  const hasActiveLivestream = userLivestreams?.some(
    stream => stream.status === 'ended' || stream.status === 'scheduled'
  );

  return {
    userLivestreams,
    isLoadingUserLivestreams,
    userLivestreamsError,
    refetchUserLivestreams,
    hasActiveLivestream
  };
};

/**
 * Hook for creating a new livestream
 */
export const useCreateLivestream = () => {
  const queryClient = useQueryClient();
  const { user } = useStore();

  const {
    mutate: createLivestream,
    isPending: isCreatingLivestream,
    error: createLivestreamError,
    isSuccess: isCreateSuccess,
    reset: resetCreateState
  } = useMutation({
    mutationFn: (data: CreateLivestreamDTO) => 
      livestreamService.createLivestream(data),
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetch
      if (user?.user_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['livestreams', 'user', user.user_id] 
        });
      }
      queryClient.invalidateQueries({ 
        queryKey: ['livestreams', 'all']
      });
    },
  });

  return {
    createLivestream,
    isCreatingLivestream,
    createLivestreamError,
    isCreateSuccess,
    resetCreateState
  };
}; 