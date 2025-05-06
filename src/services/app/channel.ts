import { IChannelDetailed } from '@/store/slices/channelSlice';
import { BaseService } from '@/services/base/base';
import { IChannel } from "@/types/app/Ichannel.type";

class ChannelService extends BaseService {
  // Get channel by ID
  async getChannelById(channelId: string): Promise<IChannel | null> {
    try {
      return await this.get<IChannel>(`/users/${channelId}`);
    } catch (error) {
      console.error("Error fetching channel:", error);
      return null;
    }
  }

  // Get channel by username - detailed version
  async getChannelByUsername(username: string): Promise<IChannelDetailed> {
    try {
      const channelData = await this.get<any>(`/users/getChannelByUserName/${username}`);
      
      // Transform response into IChannelDetailed format
      return {
        ...channelData,
        name: channelData.profile?.name || channelData.username,
        displayName: channelData.profile?.name || channelData.username,
        profileImage: channelData.avatar || '',
        bannerImage: channelData.profile?.banner_url || '',
        followers: '0', // This would come from a separate API call in a real implementation
        isPartner: false, // This would be determined based on role or other data
        isAffiliate: false, // This would be determined based on role or other data
        socialLinks: channelData.profile?.social_links || {},
        panels: [], // This would come from a separate API call
        videos: [], // This would come from a separate API call
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
    } catch (error) {
      console.error('Error fetching channel:', error);
      throw error;
    }
  }
  
  // Get channel by username - basic version
  async getChannelByUsernameBasic(username: string): Promise<IChannel | null> {
    try {
      return await this.get<IChannel>(`/users/getChannelByUserName/${username}`);
    } catch (error) {
      console.error("Error fetching channel:", error);
      return null;
    }
  }

  // Get all available channels
  async getAllChannels(): Promise<IChannel[]> {
    try {
      return await this.get<IChannel[]>('/users/channels');
    } catch (error) {
      console.error("Error fetching all channels:", error);
      return [];
    }
  }

  // Get recommended channels
  async getRecommendedChannels(userId: number): Promise<IChannel[]> {
    try {
      return await this.get<IChannel[]>(`/users/recommendedChannels?userId=${userId}&limit=10`);
    } catch (error) {
      console.error("Error fetching recommended channels:", error);
      return [];
    }
  }
  
  // Follow a channel
  async followChannel(channelId: string): Promise<boolean> {
    try {
      await this.post('/subscriptions/follow', { channelId });
      return true;
    } catch (error) {
      console.error('Error following channel:', error);
      throw error;
    }
  }
  
  // Unfollow a channel
  async unfollowChannel(channelId: string): Promise<boolean> {
    try {
      await this.delete(`/subscriptions/unfollow/${channelId}`);
      return true;
    } catch (error) {
      console.error('Error unfollowing channel:', error);
      throw error;
    }
  }
  
  // Get channel videos
  async getChannelVideos(channelId: string): Promise<any[]> {
    try {
      const videos = await this.get<any[]>(`/videos/channel/${channelId}`);
      return videos.map((video: any) => ({
        id: video.id,
        title: video.title,
        thumbnailUrl: video.thumbnail_url || '',
        duration: video.duration || '0:00',
        views: video.view_count || 0,
        createdAt: new Date(video.created_at).toLocaleDateString(),
        type: video.type || 'vod'
      }));
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      return [];
    }
  }
}

// Create instance
const channelService = new ChannelService();

// Export the instance directly
export { channelService };

// Export individual methods for direct import
export const getChannelById = channelService.getChannelById.bind(channelService);
export const getChannelByUsername = channelService.getChannelByUsernameBasic.bind(channelService);
export const getChannelByUsernameDetailed = channelService.getChannelByUsername.bind(channelService);
export const getAllChannels = channelService.getAllChannels.bind(channelService);
export const getRecommendedChannels = channelService.getRecommendedChannels.bind(channelService); 