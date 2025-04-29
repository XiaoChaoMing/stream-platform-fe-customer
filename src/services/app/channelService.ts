import { IChannel } from "@/types/app/Ichannel.type";
import { channelService as appChannelService } from "@/services/app/channel";

// In a real application, this would be an API call to your backend
// For now, we're simulating by reusing our mock data from the main channel service
export const getChannelById = async (channelId: string): Promise<IChannel | null> => {
  try {
    // Try to find channel by id (will fall back to username if needed)
    let channel = null;
    
    try {
      // First, try to find by username (which is used as channelId in ChannelCard)
      channel = await appChannelService.getChannelByUsername(channelId);
    } catch (error) {
      // If that fails, try other approaches or just return null
      console.error("Channel not found by username. Error:", error);
      return null;
    }
    
    if (!channel) {
      return null;
    }
    
    // Convert from IChannelDetailed to IChannel format
    return {
      id: channel.id,
      name: channel.name,
      avatar: channel.avatar,
      description: channel.description,
      category: channel.category,
      tags: channel.tags,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt
    };
  } catch (error) {
    console.error("Error fetching channel:", error);
    return null;
  }
};

// Get all available channels
export const getAllChannels = async (): Promise<IChannel[]> => {
  try {
    // Get the known usernames from our mock channel service
    const mockUsernames = ['summit1g', 'ninja'];
    
    // Fetch all channels by their usernames
    const channels = await Promise.all(
      mockUsernames.map(async (username) => {
        try {
          const channel = await appChannelService.getChannelByUsername(username);
          return {
            id: channel.id,
            name: channel.name,
            avatar: channel.avatar,
            description: channel.description,
            category: channel.category,
            tags: channel.tags,
            createdAt: channel.createdAt,
            updatedAt: channel.updatedAt
          };
        } catch (error) {
          console.error(`Error fetching channel ${username}:`, error);
          return null;
        }
      })
    );
    
    // Filter out any nulls from failed fetches
    return channels.filter((channel): channel is IChannel => channel !== null);
  } catch (error) {
    console.error("Error fetching all channels:", error);
    return [];
  }
}; 