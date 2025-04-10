export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  notifications: number;
}

export interface LoadingState {
  show: boolean;
}

export interface StoreState extends AuthState, AppState, LoadingState {
  // Auth actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;

  // App actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setNotifications: (count: number) => void;
  incrementNotifications: () => void;
  clearNotifications: () => void;

  // Loading actions
  showLoading: () => void;
  hideLoading: () => void;

  // Reset store
  reset: () => void;
}
// test
