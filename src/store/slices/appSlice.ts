export interface AppSlice {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  notifications: number;

  toggleTheme: () => void;
  toggleSidebar: () => void;
  setNotifications: (count: number) => void;
  incrementNotifications: () => void;
  clearNotifications: () => void;
}

export const createAppSlice = (set: any): AppSlice => ({
  theme: "light",
  sidebarOpen: true,
  notifications: 0,

  toggleTheme: () =>
    set((state: AppSlice) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      if (newTheme !== state.theme) {
        return { theme: newTheme };
      }
      return {};
    }),
  toggleSidebar: () =>
    set((state: AppSlice) => ({ sidebarOpen: !state.sidebarOpen })),
  setNotifications: (count) => set({ notifications: count }),
  incrementNotifications: () =>
    set((state: AppSlice) => ({ notifications: state.notifications + 1 })),
  clearNotifications: () => set({ notifications: 0 })
});
