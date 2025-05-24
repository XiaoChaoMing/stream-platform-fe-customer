import { useEffect, useState } from 'react';
import { useInteractQuery } from './useInteractQuery';
import { useInteractStore } from '@/store/slices/interactSlice';
import { useStore } from '@/store/useStore';
import { IComment, ICreateCommentRequest } from '@/types/app/IInteract.type';

/**
 * A simplified hook that provides all necessary functionality
 * for handling interactions with a video (likes and comments)
 */
export const useVideoInteraction = (videoId?: number) => {
  const { user } = useStore();
  const [commentToEdit, setCommentToEdit] = useState<IComment | null>(null);
  
  // Get interact state and actions from the store
  const { 
    currentLikeStatus,
    setCurrentLikeStatus,
    currentComments,
    setCurrentComments,
    appendComments,
    commentsPage,
    setReplyToComment,
    replyToCommentId,
    isReplying,
    setIsReplying,
    commentSortOrder,
    setSortOrder,
    resetState
  } = useInteractStore();
  
  // Use the React Query hook for data fetching
  const {
    likeStatus,
    isCheckingLike,
    videoComments,
    isLoadingVideoComments,
    toggleLike,
    isTogglingLike,
    createComment,
    isCreatingComment,
    updateComment,
    isUpdatingComment,
    deleteComment,
    isDeletingComment,
    loadMoreComments,
    commentReplies,
    isLoadingReplies
  } = useInteractQuery(videoId);
  
  // Update local state when data changes
  useEffect(() => {
    if (likeStatus) {
      setCurrentLikeStatus(likeStatus.liked);
    }
  }, [likeStatus, setCurrentLikeStatus]);
  
  useEffect(() => {
    if (videoComments) {
      if (commentsPage === 1) {
        setCurrentComments(videoComments);
      } else {
        appendComments(videoComments);
      }
    }
  }, [videoComments, commentsPage, setCurrentComments, appendComments]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);
  
  // Handle like toggling
  const handleLikeToggle = () => {
    if (!user?.user_id || !videoId) return;
    
    toggleLike({
      user_id: Number(user.user_id),
      video_id: Number(videoId)
    });
  };
  
  // Handle comment submission
  const handleCommentSubmit = (content: string) => {
    if (!user?.user_id || !videoId) return;
    
    const commentData: ICreateCommentRequest = {
      user_id: Number(user.user_id),
      video_id: Number(videoId),
      comment_text: content
    };
    
    // If replying to a comment, add parent_comment_id
    if (isReplying && replyToCommentId) {
      commentData.parent_comment_id = replyToCommentId;
    }
    
    createComment(commentData);
    setIsReplying(false);
  };
  
  // Handle comment editing
  const handleEditComment = (commentId: number, content: string) => {
    updateComment({ commentId, content });
    setCommentToEdit(null);
  };
  
  // Handle comment deletion
  const handleDeleteComment = (commentId: number) => {
    deleteComment(commentId);
  };
  
  // Start replying to a comment
  const handleReplyClick = (commentId: number) => {
    setReplyToComment(commentId);
  };
  
  // Start editing a comment
  const handleEditClick = (comment: IComment) => {
    setCommentToEdit(comment);
  };
  
  // Cancel editing or replying
  const handleCancel = () => {
    setIsReplying(false);
    setCommentToEdit(null);
  };
  
  // Change comment sorting
  const handleSortChange = (sortOrder: 'newest' | 'oldest' | 'popular') => {
    setSortOrder(sortOrder);
  };
  
  return {
    // State
    isLiked: currentLikeStatus,
    comments: currentComments,
    isReplying,
    replyToCommentId,
    commentToEdit,
    sortOrder: commentSortOrder,
    replies: commentReplies || [],
    
    // Loading states
    isLoadingLike: isCheckingLike || isTogglingLike,
    isLoadingComments: isLoadingVideoComments,
    isSubmittingComment: isCreatingComment,
    isEditingComment: isUpdatingComment,
    isDeletingComment,
    isLoadingReplies,
    
    // Actions
    toggleLike: handleLikeToggle,
    submitComment: handleCommentSubmit,
    editComment: handleEditComment,
    deleteComment: handleDeleteComment,
    replyToComment: handleReplyClick,
    startEditingComment: handleEditClick,
    cancelAction: handleCancel,
    loadMoreComments,
    changeSortOrder: handleSortChange
  };
}; 