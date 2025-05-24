import { create } from 'zustand';
import { ICategory } from '@/types/app/ICategory.type';

interface CategoryState {
  // Categories data
  categories: ICategory[];
  selectedCategory: ICategory | null;
  
  // UI states
  isLoading: boolean;
  error: string | null;
  
  // Filters
  search: string;
  
  // Pagination
  page: number;
  limit: number;
  totalCount: number;
  hasMore: boolean;
  
  // Actions
  setCategories: (categories: ICategory[]) => void;
  setSelectedCategory: (category: ICategory | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSearch: (search: string) => void;
  incrementPage: () => void;
  resetPage: () => void;
  setTotalCount: (count: number) => void;
  resetState: () => void;
}

const initialState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  search: '',
  page: 1,
  limit: 20,
  totalCount: 0,
  hasMore: true,
};

export const useCategoryStore = create<CategoryState>((set) => ({
  ...initialState,
  
  // Actions
  setCategories: (categories: ICategory[]) => set((state) => ({ 
    categories,
    hasMore: categories.length >= state.limit
  })),
  
  setSelectedCategory: (category: ICategory | null) => set({ 
    selectedCategory: category 
  }),
  
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  
  setError: (error: string | null) => set({ error }),
  
  setSearch: (search: string) => set({ 
    search,
    page: 1 // Reset pagination when searching
  }),
  
  incrementPage: () => set((state) => ({ 
    page: state.page + 1 
  })),
  
  resetPage: () => set({ page: 1 }),
  
  setTotalCount: (totalCount: number) => set((state) => ({ 
    totalCount,
    hasMore: state.page * state.limit < totalCount
  })),
  
  resetState: () => set(initialState)
})); 