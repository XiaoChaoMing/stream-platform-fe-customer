import { create } from 'zustand';
import { IComment, ILike } from '@/types/app/IInteract.type';

interface InteractState {
  // Current interactions
  currentLikeStatus: boolean;
  currentComments: IComment[];
  selectedComment: IComment | null;
  
  // Pagination
  commentsPage: number;
  commentsLimit: number;
  hasMoreComments: boolean;
  
  // UI states
  isReplying: boolean;
  replyToCommentId: number | null;
  isEditingComment: boolean;
  editingCommentId: number | null;
  
  // Search and sort
  commentSortOrder: 'newest' | 'oldest' | 'popular';
  commentSearchQuery: string;
  
  // Actions
  setCurrentLikeStatus: (status: boolean) => void;
  setCurrentComments: (comments: IComment[]) => void;
  appendComments: (comments: IComment[]) => void;
  setSelectedComment: (comment: IComment | null) => void;
  incrementCommentsPage: () => void;
  resetCommentsPage: () => void;
  setHasMoreComments: (hasMore: boolean) => void;
  setIsReplying: (isReplying: boolean) => void;
  setReplyToComment: (commentId: number | null) => void;
  setIsEditingComment: (isEditing: boolean) => void;
  setEditingCommentId: (commentId: number | null) => void;
  setSortOrder: (order: 'newest' | 'oldest' | 'popular') => void;
  setSearchQuery: (query: string) => void;
  resetState: () => void;
}

const initialState = {
  currentLikeStatus: false,
  currentComments: [],
  selectedComment: null,
  commentsPage: 1,
  commentsLimit: 10,
  hasMoreComments: true,
  isReplying: false,
  replyToCommentId: null,
  isEditingComment: false,
  editingCommentId: null,
  commentSortOrder: 'newest' as const,
  commentSearchQuery: '',
};

export const useInteractStore = create<InteractState>((set) => ({
  ...initialState,
  
  // Actions
  setCurrentLikeStatus: (status: boolean) => set({ currentLikeStatus: status }),
  
  setCurrentComments: (comments: IComment[]) => set({ 
    currentComments: comments,
    hasMoreComments: comments.length >= initialState.commentsLimit
  }),
  
  appendComments: (comments: IComment[]) => set((state) => ({ 
    currentComments: [...state.currentComments, ...comments],
    hasMoreComments: comments.length >= state.commentsLimit
  })),
  
  setSelectedComment: (comment: IComment | null) => set({ selectedComment: comment }),
  
  incrementCommentsPage: () => set((state) => ({ 
    commentsPage: state.commentsPage + 1 
  })),
  
  resetCommentsPage: () => set({ commentsPage: 1 }),
  
  setHasMoreComments: (hasMore: boolean) => set({ hasMoreComments: hasMore }),
  
  setIsReplying: (isReplying: boolean) => set((state: InteractState) => ({ 
    isReplying,
    // Reset reply to comment if not replying
    replyToCommentId: isReplying ? state.replyToCommentId : null
  })),
  
  setReplyToComment: (commentId: number | null) => set({ 
    replyToCommentId: commentId,
    isReplying: !!commentId
  }),
  
  setIsEditingComment: (isEditing: boolean) => set((state: InteractState) => ({ 
    isEditingComment: isEditing,
    // Reset editing comment if not editing
    editingCommentId: isEditing ? state.editingCommentId : null
  })),
  
  setEditingCommentId: (commentId: number | null) => set({ 
    editingCommentId: commentId,
    isEditingComment: !!commentId
  }),
  
  setSortOrder: (order: 'newest' | 'oldest' | 'popular') => set({ 
    commentSortOrder: order,
    commentsPage: 1 // Reset pagination when changing sort order
  }),
  
  setSearchQuery: (query: string) => set({ 
    commentSearchQuery: query,
    commentsPage: 1 // Reset pagination when searching
  }),
  
  resetState: () => set(initialState)
})); 