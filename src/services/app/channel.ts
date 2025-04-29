import axios from 'axios';
import { IChannelDetailed } from '@/store/slices/channelSlice';

// Replace with your actual API base URL
const API_URL = 'https://api.example.com';

// Mock data for channels - in a real app this would come from the API
const mockChannels: Record<string, IChannelDetailed> = {
  'summit1g': {
    id: '1',
    name: 'summit1g',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/99aa4739-21d6-40af-86ae-4b4d3457fce4-profile_image-150x150.png',
    description: "I'm a variety streamer(kind of). Been streaming since 2012(ish).",
    category: 'Gaming',
    tags: ['FPS', 'Variety', 'Shooter'],
    createdAt: '2012-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    username: 'summit1g',
    displayName: 'summit1g',
    profileImage: 'https://static-cdn.jtvnw.net/jtv_user_pictures/99aa4739-21d6-40af-86ae-4b4d3457fce4-profile_image-150x150.png',
    bannerImage: 'https://static-cdn.jtvnw.net/jtv_user_pictures/83e86af5-168e-42ff-8852-1954bb92e9b5-profile_banner-480.png',
    followers: '6.3M',
    isPartner: true,
    isAffiliate: true,
    isLive: true,
    socialLinks: {
      discord: 'https://discord.gg/summit1g',
      twitter: 'https://twitter.com/summit1g',
      instagram: 'https://instagram.com/realsummit1g',
      youtube: 'https://youtube.com/summit1g'
    },
    panels: [
      { 
        id: '1', 
        title: 'Delta Force', 
        imageUrl: 'https://panels.twitch.tv/panel-26490481-image-ca8cbd60-efe2-4f58-a052-2a5c3609a941', 
        link: 'https://bit.ly/df_summit1g' 
      },
      { 
        id: '2', 
        title: 'Star Forge PC', 
        imageUrl: 'https://panels.twitch.tv/panel-26490481-image-c1c5a072-5e9d-4cda-8723-0c9d539ecc47', 
        link: 'https://starforgepc.com/summit1g' 
      },
      { 
        id: '3', 
        title: 'Donations', 
        content: 'I do this as my full time job so donations are very much appreciated, but will never be asked for.'
      },
      { 
        id: '4', 
        title: 'FAQs', 
        content: "Q: How old are you?\nA: I am 36 years old.\n\nQ: Where are you from?\nA: Colorado, US"
      }
    ],
    videos: [
      {
        id: '1',
        title: 'Summit plays Escape from Tarkov - July 12, 2023',
        thumbnailUrl: 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/c1e1cae290aac2e3d61d_summit1g_40900335708_1689205617/thumb/thumb0-320x180.jpg',
        duration: '8h 15m',
        views: 58903,
        createdAt: '2 days ago',
        type: 'vod'
      },
      {
        id: '2',
        title: 'Summit plays Fallout 4 - July 10, 2023',
        thumbnailUrl: 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/f29db4dba95da7d70e21_summit1g_40890384732_1689033617/thumb/thumb0-320x180.jpg',
        duration: '7h 42m',
        views: 42105,
        createdAt: '4 days ago',
        type: 'vod'
      }
    ],
    schedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '12:00 PM',
      endTime: '8:00 PM',
      timezone: 'PT'
    }
  },
  'ninja': {
    id: '2',
    name: 'Ninja',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/d3e12a2e-1c84-4034-84eb-9bfaa996c41b-profile_image-150x150.png',
    description: "Professional gamer, entertainer, and content creator. Follow my socials for updates!",
    category: 'Gaming',
    tags: ['Fortnite', 'FPS', 'Battle Royale'],
    createdAt: '2011-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    username: 'ninja',
    displayName: 'Ninja',
    profileImage: 'https://static-cdn.jtvnw.net/jtv_user_pictures/d3e12a2e-1c84-4034-84eb-9bfaa996c41b-profile_image-150x150.png',
    bannerImage: 'https://static-cdn.jtvnw.net/jtv_user_pictures/ninja-profile_banner-8af0bd9ae83782e5-480.png',
    followers: '18.2M',
    isPartner: true,
    isAffiliate: true,
    isLive: true,
    socialLinks: {
      twitter: 'https://twitter.com/Ninja',
      instagram: 'https://instagram.com/ninja',
      youtube: 'https://youtube.com/ninja'
    },
    panels: [
      { 
        id: '1', 
        title: 'Merchandise', 
        content: 'Check out my merch!'
      },
      { 
        id: '2', 
        title: 'Schedule', 
        content: 'I stream Monday through Friday starting around 9 AM CT.'
      }
    ],
    videos: [
      {
        id: '1',
        title: 'Ninja plays Fortnite - July 12, 2023',
        thumbnailUrl: 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/c1e1cae290aac2e3d61d_ninja_40900335708_1689205617/thumb/thumb0-320x180.jpg',
        duration: '6h 22m',
        views: 122903,
        createdAt: '2 days ago',
        type: 'vod'
      }
    ],
    schedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '9:00 AM',
      endTime: '4:00 PM',
      timezone: 'CT'
    }
  }
};

export const channelService = {
  // Get channel by username
  getChannelByUsername: async (username: string): Promise<IChannelDetailed> => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`${API_URL}/channels/${username}`);
      // return response.data;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      if (mockChannels[username]) {
        return mockChannels[username];
      }
      
      throw new Error('Channel not found');
    } catch (error) {
      console.error('Error fetching channel:', error);
      throw error;
    }
  },
  
  // Follow a channel
  followChannel: async (channelId: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // await axios.post(`${API_URL}/channels/${channelId}/follow`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } catch (error) {
      console.error('Error following channel:', error);
      throw error;
    }
  },
  
  // Unfollow a channel
  unfollowChannel: async (channelId: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // await axios.delete(`${API_URL}/channels/${channelId}/follow`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } catch (error) {
      console.error('Error unfollowing channel:', error);
      throw error;
    }
  },
  
  // Get channel videos
  getChannelVideos: async (channelId: string): Promise<any[]> => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`${API_URL}/channels/${channelId}/videos`);
      // return response.data;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find channel in mock data
      const channel = Object.values(mockChannels).find(ch => ch.id === channelId);
      if (channel) {
        return channel.videos;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      throw error;
    }
  }
}; 