import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/app/profile';
import { IUpdateProfileRequest, IUpdateProfileWithFilesRequest } from '@/types/app/IProfile.type';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';

// Define an interface for the API response which includes a user property
interface ProfileUpdateResponse {
  user?: {
    user_id: number;
    username: string;
    email: string;
    avatar: string;
    role_id: number;
  };
  profile?: {
    banner_url?: string;
    [key: string]: any;
  };
  [key: string]: any; // Add index signature to allow additional properties
}

export const useProfileQuery = (userId?: number) => {
  const queryClient = useQueryClient();
  const { user, setUser } = useStore();
  const navigate = useNavigate();

  const { 
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getUserProfile(userId || 0),
    enabled: !!userId,
  });

  // Mutation for updating profile with file uploads
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation<ProfileUpdateResponse, Error, { userId: number, data: IUpdateProfileWithFilesRequest }>({
    mutationFn: ({ userId, data }) => 
      profileService.updateProfile(userId, data) as Promise<ProfileUpdateResponse>,
    onSuccess: (responseData, variables) => {
      // Extract avatar and banner from the response
      const newAvatar = responseData.user?.avatar;
      const newBanner = responseData.profile?.banner_url;
      
      // Immediately invalidate and refresh necessary queries
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      
      if (user && (newAvatar || newBanner)) {
        // Create updated user object with new avatar
        const updatedUser = {
          ...user
        };
        
        // Update avatar if available in response
        if (newAvatar) {
          updatedUser.avatar = newAvatar;
        }
        
        // Update the user in the global store
        setUser(updatedUser);
        
        // Manually update localStorage to ensure it's updated
        updateManuallyLocalStorage(updatedUser);
        
        // Invalidate relevant queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['channel', user.username] });
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        
        // Trigger custom storage event to force components to update
        window.dispatchEvent(new CustomEvent('app-storage-update', { 
          detail: { user: updatedUser } 
        }));
        
        // Also trigger a profile-updated event for components that need banner updates
        window.dispatchEvent(new CustomEvent('profile-updated', { 
          detail: { 
            userId,
            banner: newBanner
          } 
        }));
      }
    },
    onError: (error: any) => {
      console.error('Failed to update profile', error);
    },
  });
  
  // Function to directly manipulate localStorage
  const updateManuallyLocalStorage = (updatedUser: any) => {
    try {
      // Get the current localStorage data
      const appStorage = localStorage.getItem('app-storage');
      
      if (appStorage) {
        // Parse the current data
        const storageData = JSON.parse(appStorage);
        
        // Update the user in the localStorage data
        if (storageData.state && storageData.state.user) {
          // Make a completely new object to avoid reference issues
          storageData.state.user = { ...updatedUser };
          
          // Save the updated data back to localStorage
          const stringifiedData = JSON.stringify(storageData);
          localStorage.setItem('app-storage', stringifiedData);
        }
      }
    } catch (error) {
      console.error('Error updating localStorage', error);
    }
  };

  return {
    profile: data,
    isLoading,
    error,
    refetch,
    updateProfile,
    isUpdatingProfile,
  };
}; 