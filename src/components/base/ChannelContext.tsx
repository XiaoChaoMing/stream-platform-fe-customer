import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { IChannel, DefaultChannel } from "@/types/app/Ichannel.type";
import { getChannelByUsername } from "@/services/app/channel";

interface ChannelContextType {
  channel: IChannel;
  isLoading: boolean;
  error: string | null;
  refreshChannel: () => Promise<void>;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider = ({ 
  children, 
  channelId 
}: { 
  children: ReactNode; 
  channelId: string;
}) => {
  const [channel, setChannel] = useState<IChannel>(DefaultChannel);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannelData = async () => {
    if (!channelId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const channelData = await getChannelByUsername(channelId);
      if (channelData) {
        setChannel(channelData);
      } else {
        setError("Channel not found");
      }
    } catch (error) {
      console.error("Failed to fetch channel:", error);
      setError("Failed to load channel data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelData();
  }, [channelId]);

  return (
    <ChannelContext.Provider
      value={{
        channel,
        isLoading,
        error,
        refreshChannel: fetchChannelData
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannel = () => {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error("useChannel must be used within a ChannelProvider");
  }
  return context;
}; 