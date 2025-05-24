import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  videoService, 
  ICreateVideoRequest,
} from '@/services/app/video';
import { useStore } from '@/store/useStore';

// Define pagination parameters interface
export interface IPaginationParams {
  limit?: number;
  page?: number;
}

/**
 * Hook for managing video-related queries and mutations
 */
export const useVideoQuery = (paginationParams?: IPaginationParams) => {
  const queryClient = useQueryClient();
  const { user } = useStore();
  const { limit, page } = paginationParams || {};

  // get all videos
  const {
    data: allVideos,
    isLoading: isLoadingAllVideos,
    error: allVideosError,
    refetch: refetchAllVideos
  } = useQuery({
    queryKey: ['allVideos', limit, page],
    queryFn: () => videoService.getAllVideos(limit, page),
  });
  
  /**
   * Get current user's videos
   */
  const { 
    data: userVideos,
    isLoading: isLoadingUserVideos,
    error: userVideosError,
    refetch: refetchUserVideos
  } = useQuery({
    queryKey: ['userVideos', user?.user_id, limit, page],
    queryFn: () => user?.user_id ? videoService.getVideosByUserId(Number(user.user_id), limit, page) : Promise.resolve([]),
    enabled: !!user?.user_id,
  });
  
  // /**
  //  * Get latest videos
  //  */
  // const { 
  //   data: latestVideos,
  //   isLoading: isLoadingLatestVideos,
  //   error: latestVideosError,
  //   refetch: refetchLatestVideos
  // } = useQuery({
  //   queryKey: ['latestVideos', limit, page],
  //   queryFn: () => videoService.getLatestVideos(limit, page),
  // });
  
  /**
   * Create video mutation
   */
  const { 
    mutate: createVideo, 
    isPending: isCreatingVideo,
    error: createVideoError,
    data: createdVideo
  } = useMutation({
    mutationFn: (data: ICreateVideoRequest) => videoService.createVideo(data),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      if (user?.user_id) {
        queryClient.invalidateQueries({ queryKey: ['userVideos', user.user_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['latestVideos'] });
      queryClient.invalidateQueries({ queryKey: ['channelVideos'] });
      queryClient.invalidateQueries({ queryKey: ['allVideos'] });
    }
  });
  
  /**
   * Delete video mutation
   */
  const { 
    mutate: deleteVideo, 
    isPending: isDeletingVideo,
    error: deleteVideoError
  } = useMutation({
    mutationFn: (videoId: string | number) => videoService.deleteVideo(videoId),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      if (user?.user_id) {
        queryClient.invalidateQueries({ queryKey: ['userVideos', user.user_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['latestVideos'] });
      queryClient.invalidateQueries({ queryKey: ['channelVideos'] });
      queryClient.invalidateQueries({ queryKey: ['allVideos'] });
    }
  });
  
  /**
   * Update video details mutation
   */
  const { 
    mutate: updateVideoDetails, 
    isPending: isUpdatingVideo,
    error: updateVideoError
  } = useMutation({
    mutationFn: ({ 
      videoId, 
      data 
    }: { 
      videoId: string | number, 
      data: { title?: string; description?: string } 
    }) => videoService.updateVideoDetails(videoId, data),
    onSuccess: (data) => {
      // Invalidate and update queries
      queryClient.invalidateQueries({ queryKey: ['video', data.video_id] });
      if (user?.user_id) {
        queryClient.invalidateQueries({ queryKey: ['userVideos', user.user_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['latestVideos'] });
      queryClient.invalidateQueries({ queryKey: ['channelVideos'] });
      queryClient.invalidateQueries({ queryKey: ['allVideos'] });
    }
  });
  
  /**
   * Get video by ID query factory
   */
  const getVideoById = (videoId?: string | number) => {
    return useQuery({
      queryKey: ['video', videoId],
      queryFn: () => videoId ? videoService.getVideoById(videoId) : Promise.resolve(null),
      enabled: !!videoId,
    });
  };
  
  return {
    // Queries
    userVideos,
    isLoadingUserVideos,
    userVideosError,
    refetchUserVideos,
    
    // latestVideos,
    // isLoadingLatestVideos,
    // latestVideosError,
    // refetchLatestVideos,
    
    // Query factory
    getVideoById,
    // check lai get all videos
    refetchAllVideos,
    allVideos,
    isLoadingAllVideos,
    allVideosError,
    
    // Mutations
    createVideo,
    isCreatingVideo,
    createVideoError,
    createdVideo,
    
    deleteVideo,
    isDeletingVideo,
    deleteVideoError,
    
    updateVideoDetails,
    isUpdatingVideo,
    updateVideoError,
  };
}; 