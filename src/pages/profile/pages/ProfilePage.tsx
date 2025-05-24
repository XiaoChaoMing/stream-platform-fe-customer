import { useEffect, useState } from 'react';
import { ProfileUpdateForm } from '@/components/app/profile/ProfileUpdateForm';
import { useStore } from '@/store/useStore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useStore();
  const navigate = useNavigate();
  const [formKey, setFormKey] = useState(0);
  
  // Use the user_id from the store or fall back to 0
  const userId = user?.user_id ? parseInt(user.user_id.toString()) : 0;
  // Use userId as profileId since they are the same for the current user
  const profileId = userId || '';
  
  // When user changes, update the form key to re-render with fresh data
  useEffect(() => {
    setFormKey(prev => prev + 1);
  }, [user]);

  // Handle successful profile update
  const handleProfileUpdateSuccess = () => {
    // Show success message and navigate back to the channel page after a short delay
    setTimeout(() => {
      if (user?.username) {
        navigate(`/channel/${user.username}`);
      }
    }, 1500);
  };

  // If no user is logged in, redirect to login
  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('Please log in to edit your profile')}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('Edit Profile')}</h1>
        <div className="bg-card rounded-lg p-6">
          <ProfileUpdateForm 
            key={formKey}
            userId={userId}
            profileId={profileId}
            onSuccess={handleProfileUpdateSuccess}
          />
        </div>
      </div>
    </div>
  );
}
