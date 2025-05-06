import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface VideoInfoProps {
  title: string;
  views: number;
  createdAt: string;
  channelName: string;
}

export const VideoInfo: React.FC<VideoInfoProps> = ({ 
  title, 
  views, 
  createdAt, 
  channelName 
}) => {
  // Format the date to show in a "X days/hours/minutes ago" format
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  // Format views number (e.g., 1,234 or 1.2K)
  const formatViews = (count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="video-info">
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      
      <div className="flex items-center text-sm text-neutral-400 mb-4">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
          </svg>
          {formatViews(views)} views
        </span>
        
        <span className="mx-2">•</span>
        
        <span>{timeAgo}</span>
        
        <span className="mx-2">•</span>
        
        <span>Clipped by {channelName}</span>
      </div>
      
      <div className="flex gap-2">
        <button className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
          </svg>
          Share
        </button>
        
        <button className="inline-flex items-center px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          Like
        </button>
        
        <button className="inline-flex items-center px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
          </svg>
          Save
        </button>
      </div>
    </div>
  );
}; 