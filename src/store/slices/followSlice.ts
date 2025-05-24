import { create } from 'zustand';
import { ISubscription } from '@/types/app/IFollow.type';

interface FollowState {
  // Current subscription status
  isSubscribed: boolean;
  
  // Subscriptions data
  followingList: ISubscription[];
  followersList: ISubscription[];
  
  // Stats
  followerCount: number;
  followingCount: number;
  
  // Pagination
  followersPage: number;
  followingPage: number;
  followersLimit: number;
  followingLimit: number;
  hasMoreFollowers: boolean;
  hasMoreFollowing: boolean;
  
  // Selected channel for subscription operations
  selectedChannelId: number | null;
  
  // Actions
  setIsSubscribed: (status: boolean) => void;
  setFollowingList: (following: ISubscription[]) => void;
  setFollowersList: (followers: ISubscription[]) => void;
  appendFollowing: (following: ISubscription[]) => void;
  appendFollowers: (followers: ISubscription[]) => void;
  setFollowerCount: (count: number) => void;
  setFollowingCount: (count: number) => void;
  incrementFollowersPage: () => void;
  incrementFollowingPage: () => void;
  resetFollowersPage: () => void;
  resetFollowingPage: () => void;
  setSelectedChannelId: (channelId: number | null) => void;
  resetState: () => void;
}

const initialState = {
  isSubscribed: false,
  followingList: [],
  followersList: [],
  followerCount: 0,
  followingCount: 0,
  followersPage: 1,
  followingPage: 1,
  followersLimit: 10,
  followingLimit: 10,
  hasMoreFollowers: true,
  hasMoreFollowing: true,
  selectedChannelId: null,
};

export const useFollowStore = create<FollowState>((set) => ({
  ...initialState,
  
  // Actions
  setIsSubscribed: (status: boolean) => set({ isSubscribed: status }),
  
  setFollowingList: (following: ISubscription[]) => set({ 
    followingList: following,
    followingCount: following.length,
    hasMoreFollowing: following.length >= initialState.followingLimit
  }),
  
  setFollowersList: (followers: ISubscription[]) => set({ 
    followersList: followers,
    followerCount: followers.length,
    hasMoreFollowers: followers.length >= initialState.followersLimit
  }),
  
  appendFollowing: (following: ISubscription[]) => set((state) => ({ 
    followingList: [...state.followingList, ...following],
    followingCount: state.followingList.length + following.length,
    hasMoreFollowing: following.length >= state.followingLimit
  })),
  
  appendFollowers: (followers: ISubscription[]) => set((state) => ({ 
    followersList: [...state.followersList, ...followers],
    followerCount: state.followersList.length + followers.length,
    hasMoreFollowers: followers.length >= state.followersLimit
  })),
  
  setFollowerCount: (count: number) => set({ followerCount: count }),
  
  setFollowingCount: (count: number) => set({ followingCount: count }),
  
  incrementFollowersPage: () => set((state) => ({ 
    followersPage: state.followersPage + 1 
  })),
  
  incrementFollowingPage: () => set((state) => ({ 
    followingPage: state.followingPage + 1 
  })),
  
  resetFollowersPage: () => set({ followersPage: 1 }),
  
  resetFollowingPage: () => set({ followingPage: 1 }),
  
  setSelectedChannelId: (channelId: number | null) => set({ 
    selectedChannelId: channelId 
  }),
  
  resetState: () => set(initialState)
})); 