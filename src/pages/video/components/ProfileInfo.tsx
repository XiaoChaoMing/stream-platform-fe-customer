import React from 'react';
import { IVideoResponse } from '@/services/app/video';

interface ProfileInfoProps {
  user: IVideoResponse['user'];
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const { username, avatar, _count, profile } = user;
  const name = profile?.name || username;
  const subscriptionCount = _count?.subscribers || 0;

  // Format followers count (e.g., 1,234 or 1.2K)
  const formatFollowers = (count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
          <img 
            src={avatar || 'https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png'} 
            alt={`${name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-neutral-400">{formatFollowers(subscriptionCount)} subscribers</p>
        </div>
      </div>
      
      <button className="px-4 py-1.5 bg-primary text-background text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
        Subscribe
      </button>
    </div>
  );
}; 