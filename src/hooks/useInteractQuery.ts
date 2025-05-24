import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  interactService,
} from '@/services/app/interact';
import { 
  ICreateCommentRequest, 
  ICommentFilter,
} from '@/types/app/IInteract.type';
import { useStore } from '@/store/useStore';
import { useInteractStore } from '@/store/slices/interactSlice';

/**
 * Hook for managing interaction-related queries and mutations
 */
export const useInteractQuery = (videoId?: number, commentId?: number) => {
  const queryClient = useQueryClient();
  const { user } = useStore();
  const { 
    incrementCommentsPage, 
    commentsPage, 
    commentsLimit,
    commentSortOrder 
  } = useInteractStore();

  // Filter for comments query
  const commentFilter: ICommentFilter = {
    videoId,
    limit: commentsLimit,
    page: commentsPage,
    sortBy: commentSortOrder
  };

  /**
   * Check if current user has liked the video
   */
  const {
    data: likeStatus,
    isLoading: isCheckingLike,
    refetch: refetchLikeStatus
  } = useQuery({
    queryKey: ['likes', 'check', user?.user_id, videoId],
    queryFn: () => user?.user_id && videoId 
      ? interactService.checkUserLiked(Number(user.user_id), Number(videoId))
      : Promise.resolve({ liked: false }),
    enabled: !!user?.user_id && !!videoId,
  });

  /**
   * Get likes by video ID
   */
  const {
    data: videoLikes,
    isLoading: isLoadingVideoLikes,
    refetch: refetchVideoLikes
  } = useQuery({
    queryKey: ['likes', 'video', videoId],
    queryFn: () => videoId 
      ? interactService.getLikesByVideo(Number(videoId))
      : Promise.resolve([]),
    enabled: !!videoId,
  });

  /**
   * Get comments by video ID
   */
  const {
    data: videoComments,
    isLoading: isLoadingVideoComments,
    refetch: refetchVideoComments
  } = useQuery({
    queryKey: ['comments', 'video', videoId, commentsPage, commentsLimit, commentSortOrder],
    queryFn: () => videoId 
      ? interactService.getCommentsByVideo(Number(videoId))
      : Promise.resolve([]),
    enabled: !!videoId,
  });

  /**
   * Get comment replies
   */
  const {
    data: commentReplies,
    isLoading: isLoadingReplies,
    refetch: refetchReplies
  } = useQuery({
    queryKey: ['comments', 'replies', commentId],
    queryFn: () => commentId 
      ? interactService.getCommentReplies(commentId)
      : Promise.resolve([]),
    enabled: !!commentId,
  });

  /**
   * Get comment by ID
   */
  const {
    data: comment,
    isLoading: isLoadingComment,
    refetch: refetchComment
  } = useQuery({
    queryKey: ['comment', commentId],
    queryFn: () => commentId 
      ? interactService.getCommentById(commentId)
      : Promise.resolve(null),
    enabled: !!commentId,
  });

  /**
   * Toggle like mutation
   */
  const {
    mutate: toggleLike,
    isPending: isTogglingLike
  } = useMutation({
    mutationFn: (data: { user_id: number, video_id: number }) => 
      interactService.toggleLike(data),
    onSuccess: () => {
      // Invalidate relevant queries
      if (user?.user_id && videoId) {
        queryClient.invalidateQueries({ 
          queryKey: ['likes', 'check', user.user_id, videoId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['likes', 'video', videoId] 
        });
      }
    }
  });

  /**
   * Create comment mutation
   */
  const {
    mutate: createComment,
    isPending: isCreatingComment
  } = useMutation({
    mutationFn: (data: ICreateCommentRequest) => 
      interactService.createComment(data),
    onSuccess: (newComment) => {
      // Invalidate relevant queries
      if (videoId) {
        queryClient.invalidateQueries({ 
          queryKey: ['comments', 'video', videoId] 
        });
      }

      // If this is a reply, also invalidate the parent comment's replies
      if (newComment.parent_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['comments', 'replies', newComment.parent_id] 
        });
      }
    }
  });

  /**
   * Update comment mutation
   */
  const {
    mutate: updateComment,
    isPending: isUpdatingComment
  } = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number, content: string }) => 
      interactService.updateComment(commentId, content),
    onSuccess: (updatedComment) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ['comment', updatedComment.comment_id] 
      });

      if (videoId) {
        queryClient.invalidateQueries({ 
          queryKey: ['comments', 'video', videoId] 
        });
      }

      if (updatedComment.parent_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['comments', 'replies', updatedComment.parent_id] 
        });
      }
    }
  });

  /**
   * Delete comment mutation
   */
  const {
    mutate: deleteComment,
    isPending: isDeletingComment
  } = useMutation({
    mutationFn: (commentId: number) => 
      interactService.deleteComment(commentId),
    onSuccess: (_data, deletedCommentId, context) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ['comment', deletedCommentId] 
      });

      if (videoId) {
        queryClient.invalidateQueries({ 
          queryKey: ['comments', 'video', videoId] 
        });
      }

      // We don't know the parent ID here since the comment is deleted
      // so we need to invalidate all comment queries to be safe
      queryClient.invalidateQueries({ 
        queryKey: ['comments'] 
      });
    }
  });

  // Helper function to load more comments
  const loadMoreComments = () => {
    incrementCommentsPage();
  };

  return {
    // Like queries
    likeStatus,
    isCheckingLike,
    refetchLikeStatus,
    videoLikes,
    isLoadingVideoLikes,
    refetchVideoLikes,

    // Comment queries
    videoComments,
    isLoadingVideoComments,
    refetchVideoComments,
    commentReplies,
    isLoadingReplies,
    refetchReplies,
    comment,
    isLoadingComment,
    refetchComment,

    // Mutations
    toggleLike,
    isTogglingLike,
    createComment,
    isCreatingComment,
    updateComment,
    isUpdatingComment,
    deleteComment,
    isDeletingComment,

    // Pagination
    loadMoreComments,
  };
}; 