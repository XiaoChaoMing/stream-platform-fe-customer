import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createAuthSlice, type AuthSlice } from "./slices/authSlice";
import { createAppSlice, type AppSlice } from "./slices/appSlice";
import { createLoadingSlice, type LoadingSlice } from "./slices/loadingSlice";

export type StoreState = AuthSlice &
  AppSlice &
  LoadingSlice & {
    reset: () => void;
  };

const initialState = {
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // App state
  theme: "light" as const,
  sidebarOpen: true,
  notifications: 0,

  // Loading state
  show: false
};

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        ...createAuthSlice(set),
        ...createAppSlice(set),
        ...createLoadingSlice(set),
        reset: () => set(initialState)
      }),
      {
        name: "app-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          theme: state.theme
        })
      }
    )
  )
);
