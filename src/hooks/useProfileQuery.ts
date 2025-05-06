import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/app/profile';
import { IUpdateProfileRequest } from '@/types/app/IProfile.type';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';

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

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: ({ profileId, data }: { profileId: string | number, data: IUpdateProfileRequest }) => 
      profileService.updateProfile(profileId, data),
    onSuccess: (updatedProfile, variables) => {
      // Invalidate the profile query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      
      // Check if username was updated and update the user in store
      if (variables.data.username && user && variables.data.username !== user.username) {
        const newUsername = variables.data.username;
        
        // Create updated user object
        const updatedUser = {
          ...user,
          username: newUsername,
          // If avatar was updated, update it in the user object too
          ...(variables.data.avatar ? { avatar: variables.data.avatar } : {})
        };
        
        // Update the user in the store
        setUser(updatedUser);
        
        // Manually update localStorage to ensure persistence
        const storedData = localStorage.getItem('app-storage');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            parsedData.state.user = updatedUser;
            localStorage.setItem('app-storage', JSON.stringify(parsedData));
          } catch (e) {
            console.error('Error updating localStorage:', e);
          }
        }
        
        // If we're on a channel page with the old username, navigate to the new username
        const currentPath = window.location.pathname;
        if (currentPath.includes(`/channel/${user.username}`)) {
          // Redirect to the new channel URL
          navigate(currentPath.replace(`/channel/${user.username}`, `/channel/${newUsername}`));
        }
        
        // Invalidate the channel query for both old and new usernames
        queryClient.invalidateQueries({ queryKey: ['channel', user.username] });
        queryClient.invalidateQueries({ queryKey: ['channel', newUsername] });
      } else if (variables.data.avatar && user) {
        // If only avatar was updated, still update the user in store
        const updatedUser = {
          ...user,
          avatar: variables.data.avatar
        };
        
        // Update the user in the store
        setUser(updatedUser);
        
        // Manually update localStorage
        const storedData = localStorage.getItem('app-storage');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            parsedData.state.user = updatedUser;
            localStorage.setItem('app-storage', JSON.stringify(parsedData));
          } catch (e) {
            console.error('Error updating localStorage:', e);
          }
        }
        
        // Invalidate the channel query as avatar might have changed
        if (user.username) {
          queryClient.invalidateQueries({ queryKey: ['channel', user.username] });
        }
      }
      
      console.log('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Failed to update profile', error.message || 'Unknown error');
    },
  });

  return {
    profile: data,
    isLoading,
    error,
    refetch,
    updateProfile,
    isUpdatingProfile,
  };
}; 