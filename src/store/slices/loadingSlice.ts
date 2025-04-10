export interface LoadingSlice {
  show: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

export const createLoadingSlice = (set: any): LoadingSlice => ({
  show: false,
  showLoading: () => set({ show: true }),
  hideLoading: () => set({ show: false })
});
