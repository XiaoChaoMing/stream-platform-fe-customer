import { create } from 'zustand';
import { ILivestream } from '@/types/app/ILivestream.type';

interface LivestreamState {
  // Livestreams from followed users
  followingLivestreams: ILivestream[];
  
  // UI states
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  page: number;
  limit: number;
  hasMore: boolean;
  
  // Actions
  setFollowingLivestreams: (livestreams: ILivestream[]) => void;
  appendFollowingLivestreams: (livestreams: ILivestream[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  incrementPage: () => void;
  resetState: () => void;
}

const initialState = {
  followingLivestreams: [],
  isLoading: false,
  error: null,
  page: 1,
  limit: 10,
  hasMore: true,
  statusFilter: 'live' as const,
};

export const useLivestreamStore = create<LivestreamState>((set) => ({
  ...initialState,
  
  // Actions
  setFollowingLivestreams: (livestreams: ILivestream[]) => set((state) => ({ 
    followingLivestreams: livestreams,
    hasMore: livestreams.length >= state.limit
  })),
  
  appendFollowingLivestreams: (livestreams: ILivestream[]) => set((state) => ({ 
    followingLivestreams: [...state.followingLivestreams, ...livestreams],
    hasMore: livestreams.length >= state.limit
  })),
  
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  
  setError: (error: string | null) => set({ error }),
  
  incrementPage: () => set((state) => ({ 
    page: state.page + 1 
  })),
  
  resetState: () => set(initialState)
})); 