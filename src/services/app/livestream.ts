import { BaseService } from '../base/base';
import { ILivestream, ILivestreamFilter } from '@/types/app/ILivestream.type';

interface CreateLivestreamDTO {
  title: string;
  description?: string;
  user_id: number;
  thumbnail?: File;
}

class LivestreamService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Get all livestreams
   */
  async getAllLivestreams(): Promise<ILivestream[]> {
    try {
      const response = await this.get<ILivestream[]>('/livestreams/all');
      return response;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get livestreams from users the specified user is following
   */
  async getLivestreamsByFollowing(userId: number): Promise<ILivestream[]> {
    try {
      let url = `/livestreams/following/${userId}`;
      
      const response = await this.get<ILivestream[]>(url);
      return response;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get livestreams by user ID
   * @param userId - The ID of the user whose livestreams to fetch
   * @returns Promise<ILivestream[]> - Array of livestreams for the specified user
   * @throws Error if the request fails or no livestreams are found
   */
  async getLivestreamsByUserId(userId: number): Promise<ILivestream[]> {
    try {
      const response = await this.get<ILivestream[]>(`/livestreams/user/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new livestream profile
   * @param data - The livestream data including title, description, user_id and optional thumbnail
   * @returns Promise<ILivestream> - The created livestream profile
   */
  async createLivestream(data: CreateLivestreamDTO): Promise<ILivestream> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('user_id', data.user_id.toString());
      
      if (data.description) {
        formData.append('description', data.description);
      }
      
      if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
      }

      const response = await this.post<ILivestream>('/livestreams', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const livestreamService = new LivestreamService(); 