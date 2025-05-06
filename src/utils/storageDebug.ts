/**
 * Utility functions to debug and manage localStorage data
 */

/**
 * Logs the current user data stored in localStorage
 */
export function logUserDataFromStorage(): void {
  try {
    const storageData = localStorage.getItem('app-storage');
    if (storageData) {
      const parsed = JSON.parse(storageData);
      console.log('User data in localStorage:', parsed?.state?.user);
    } else {
      console.log('No app-storage data found in localStorage');
    }
  } catch (error) {
    console.error('Error reading localStorage:', error);
  }
}

/**
 * Forces an update of the user data in localStorage
 * @param userData Updated user data to store
 * @returns boolean indicating success
 */
export function forceUpdateUserStorage(userData: any): boolean {
  try {
    const storageData = localStorage.getItem('app-storage');
    if (storageData) {
      const parsed = JSON.parse(storageData);
      parsed.state.user = userData;
      localStorage.setItem('app-storage', JSON.stringify(parsed));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating localStorage:', error);
    return false;
  }
}

/**
 * Syncs Zustand store with localStorage
 * Call this function to manually trigger a save to localStorage
 * @param state The current Zustand state
 */
export function syncStoreWithStorage(state: any): void {
  try {
    const storageData = localStorage.getItem('app-storage');
    if (storageData) {
      const parsed = JSON.parse(storageData);
      parsed.state = {
        ...parsed.state,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme
      };
      localStorage.setItem('app-storage', JSON.stringify(parsed));
      console.log('Successfully synced state to localStorage');
    }
  } catch (error) {
    console.error('Error syncing with localStorage:', error);
  }
} 