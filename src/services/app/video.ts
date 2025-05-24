import { BaseService } from "../base/base";

// Define interface for creating video request
export interface ICreateVideoRequest {
  user_id: number;
  title: string;
  description?: string;
  videoFile?: File;
  thumbnailFile?: File;
}

// Define interface for video response
export interface IVideoResponse {
  video_id: string | number;
  user_id: number;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  view_count?: number;
  upload_date?: string;
  user: {
    user_id: number;
    username: string;
    avatar: string;
    _count: {
      subscribers: number;
    };
    profile: {
      name: string;
    };
  };
  _count: {
    likes: number;
  };
  created_at: string;
  updated_at?: string;
}

// Interface for presigned URL request/response
export interface IPresignedUrlRequest {
  filename: string;
  folder?: string;
  expiryInSeconds?: number;
}

export interface IPresignedUrlResponse {
  url: string;
  objectName: string;
  fileUrl: string;
}

class VideoService extends BaseService {
  private apiUrl: string;

  constructor() {
    super();
    this.apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  }

  async getAllVideos(limit?: number, page?: number): Promise<IVideoResponse[]> {
    try {
      let url = '/videos';
      
      // Add pagination parameters if provided
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (page) params.append('page', page.toString());
      
      // Append query parameters if any exist
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await this.api.get<IVideoResponse[]>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a presigned URL for direct file upload
   */
  async getPresignedUrl(data: IPresignedUrlRequest): Promise<IPresignedUrlResponse> {
    try {
      const response = await this.api.post<IPresignedUrlResponse>(
        '/uploads/presigned-url',
        data
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload a file directly to storage using a presigned URL
   */
  async uploadFileWithPresignedUrl(file: File, presignedUrl: string): Promise<void> {
    try {
      await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new video by sending the video data and files to the API
   * The API will handle the file uploads to storage
   * 
   * @param data - Video data including files
   * @returns Promise with video response
   */
  async createVideo(data: ICreateVideoRequest): Promise<IVideoResponse> {
    try {
      // Create FormData to send files and data in one request
      const formData = new FormData();
      
      // Add video data
      formData.append('user_id', data.user_id.toString());
      formData.append('title', data.title);
      
      if (data.description) {
        formData.append('description', data.description);
      }
      
      // Add files if they exist
      if (data.videoFile) {
        formData.append('videoFile', data.videoFile);
      }
      
      if (data.thumbnailFile) {
        formData.append('thumbnailFile', data.thumbnailFile);
      }
      
      // Send the data to the API
      const response = await this.api.post<IVideoResponse>(
        '/videos',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a video by ID
   */
  async getVideoById(videoId: string | number): Promise<IVideoResponse> {
    try {
      const response = await this.get<IVideoResponse>(`/videos/${videoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get videos by user ID
   * @param userId - The user ID to fetch videos for
   * @param limit - Optional limit for pagination
   * @param page - Optional page number for pagination
   */
  async getVideosByUserId(userId: number, limit?: number, page?: number): Promise<IVideoResponse[]> {
    try {
      let url = `/videos/user/${userId}`;
      
      // Add pagination parameters if provided
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (page) params.append('page', page.toString());
      
      // Append query parameters if any exist
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await this.get<IVideoResponse[]>(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get latest videos
   * @param limit - Optional limit of videos to return
   * @param page - Optional page number for pagination
   */
  async getLatestVideos(limit?: number, page?: number): Promise<IVideoResponse[]> {
    try {
      let url = '/videos/latest';
      
      // Add pagination parameters if provided
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (page) params.append('page', page.toString());
      
      // Append query parameters if any exist
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await this.get<IVideoResponse[]>(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a video by ID
   */
  async deleteVideo(videoId: string | number): Promise<void> {
    try {
      await this.delete(`/videos/${videoId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update video details (metadata, not files)
   * @param videoId - The ID of the video to update
   * @param data - The data to update
   */
  async updateVideoDetails(videoId: string | number, data: {
    title?: string;
    description?: string;
  }): Promise<IVideoResponse> {
    try {
      const response = await this.api.put<IVideoResponse>(`/videos/${videoId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const videoService = new VideoService();

// Export individual methods for direct use
export const createVideo = videoService.createVideo.bind(videoService);
export const getVideoById = videoService.getVideoById.bind(videoService);
export const getVideosByUserId = videoService.getVideosByUserId.bind(videoService);
export const getLatestVideos = videoService.getLatestVideos.bind(videoService);
export const deleteVideo = videoService.deleteVideo.bind(videoService);
export const updateVideoDetails = videoService.updateVideoDetails.bind(videoService);
export const getPresignedUrl = videoService.getPresignedUrl.bind(videoService);
export const uploadFileWithPresignedUrl = videoService.uploadFileWithPresignedUrl.bind(videoService); 
export const getAllVideos = videoService.getAllVideos.bind(videoService);