import React from 'react';

interface ProfileInfoProps {
  name: string;
  avatar: string;
  followers: number;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ name, avatar, followers }) => {
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
            src={avatar} 
            alt={`${name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-neutral-400">{formatFollowers(followers)} followers</p>
        </div>
      </div>
      
      <button className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
        Follow
      </button>
    </div>
  );
}; 