// Comment interfaces
export interface IComment {
  comment_id: number;
  user_id: number;
  video_id: number;
  parent_id?: number;
  comment_text: string;
  created_at: string;
  updated_at?: string;
  user?: {
    user_id: number;
    username: string;
    avatar?: string;
    profile?: {
      name: string;
    }
  };
  replies?: IComment[];
  _count?: {
    replies: number;
    likes?: number;
  };
}

export interface ICreateCommentRequest {
  user_id: number;
  video_id: number;
  comment_text: string;
  parent_comment_id?: number;
}

export interface IUpdateCommentRequest {
  content: string;
}

// Like interfaces
export interface ILike {
  like_id: number;
  user_id: number;
  video_id: number;
  created_at: string;
}

export interface ICreateLikeRequest {
  user_id: number;
  video_id: number;
}

export interface ILikeCheckResponse {
  liked: boolean;
}

// Response interfaces for API endpoints
export interface ICreateCommentResponse extends IComment {}

export interface IUpdateCommentResponse extends IComment {}

export interface IToggleLikeResponse {
  liked: boolean;
}

// Additional interface for comment counts
export interface ICommentCount {
  count: number;
  video_id: number;
}

// Filter interface for comment queries
export interface ICommentFilter {
  videoId?: number;
  userId?: number;
  parentId?: number;
  limit?: number;
  page?: number;
  sortBy?: 'newest' | 'oldest' | 'popular';
} 