import { BaseService } from '../base/base';
import { 
  IComment, 
  ICreateCommentRequest, 
  ILike, 
  ICreateLikeRequest, 
  ILikeCheckResponse,
  IToggleLikeResponse
} from '@/types/app/IInteract.type';

class InteractService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Toggle a like for a video (add or remove)
   */
  async toggleLike(data: ICreateLikeRequest): Promise<IToggleLikeResponse> {
    try {
      const response = await this.api.post<IToggleLikeResponse>('/interact/like', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get likes by video ID
   */
  async getLikesByVideo(videoId: number): Promise<ILike[]> {
    try {
      const response = await this.get<ILike[]>(`/interact/likes/video/${videoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get likes by user ID
   */
  async getLikesByUser(userId: number): Promise<ILike[]> {
    try {
      const response = await this.get<ILike[]>(`/interact/likes/user/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if a user has liked a video
   */
  async checkUserLiked(userId: number, videoId: number): Promise<ILikeCheckResponse> {
    try {
      const response = await this.get<ILikeCheckResponse>(`/interact/like/check/${userId}/${videoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new comment
   */
  async createComment(data: ICreateCommentRequest): Promise<IComment> {
    try {
      const response = await this.api.post<IComment>('/interact/comment', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a comment
   */
  async updateComment(commentId: number, content: string): Promise<IComment> {
    try {
      const response = await this.api.put<IComment>(`/interact/comment/${commentId}`, { content });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: number): Promise<void> {
    try {
      await this.api.delete(`/interact/comment/${commentId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get comments by video ID
   */
  async getCommentsByVideo(videoId: number): Promise<IComment[]> {
    try {
      const response = await this.get<IComment[]>(`/interact/comments/video/${videoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get comments by user ID
   */
  async getCommentsByUser(userId: number): Promise<IComment[]> {
    try {
      const response = await this.get<IComment[]>(`/interact/comments/user/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get replies to a comment
   */
  async getCommentReplies(commentId: number): Promise<IComment[]> {
    try {
      const response = await this.get<IComment[]>(`/interact/comments/replies/${commentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a comment by ID
   */
  async getCommentById(commentId: number): Promise<IComment> {
    try {
      const response = await this.get<IComment>(`/interact/comment/${commentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const interactService = new InteractService();
