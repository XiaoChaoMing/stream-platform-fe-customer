import { create } from 'zustand';
import { IChannel, DefaultChannel } from '@/types/app/Ichannel.type';

export interface VideoData {
  video_id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  views: number;
  createdAt: string;
  type: 'vod' | 'clip' | 'highlight';
}

export interface IPanel {
  id: string;
  title: string;
  imageUrl?: string;
  content?: string;
  link?: string;
}

export interface ISchedule {
  days: string[];
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface ISocialLinks {
  discord?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

export interface IChannelDetailed extends IChannel {
  displayName: string;
  profileImage: string;
  bannerImage: string;
  followers_count: number;
  isPartner: boolean;
  isAffiliate: boolean;
  socialLinks: ISocialLinks;
  panels: IPanel[];
  videos: VideoData[];
  schedule: ISchedule;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DefaultChannelDetailed: IChannelDetailed = {
  ...DefaultChannel,
  displayName: '',
  profileImage: '',
  bannerImage: '',
  followers_count: 0,
  isPartner: false,
  isAffiliate: false,
  socialLinks: {},
  panels: [],
  videos: [],
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

interface ChannelState {
  currentChannel: IChannelDetailed;
  isLoading: boolean;
  error: string | null;
  isFollowing: boolean;
  isEditingMode: boolean;
  isOwnChannel: boolean;
  
  // Actions
  setChannel: (channel: IChannelDetailed) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleFollow: () => void;
  toggleEditMode: () => void;
  setIsOwnChannel: (isOwn: boolean) => void;
  resetState: () => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  currentChannel: DefaultChannelDetailed,
  isLoading: false,
  error: null,
  isFollowing: false,
  isEditingMode: false,
  isOwnChannel: false,
  
  setChannel: (channel) => set({ currentChannel: channel }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  toggleFollow: () => set((state) => ({ isFollowing: !state.isFollowing })),
  toggleEditMode: () => set((state) => ({ isEditingMode: !state.isEditingMode })),
  setIsOwnChannel: (isOwn) => set({ isOwnChannel: isOwn }),
  resetState: () => set({ 
    currentChannel: DefaultChannelDetailed, 
    isLoading: false,
    error: null,
    isFollowing: false,
    isEditingMode: false,
    isOwnChannel: false
  })
})); 