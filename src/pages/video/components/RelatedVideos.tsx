import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface RelatedVideosProps {
  currentVideoId: string;
}

interface VideoItem {
  id: string;
  title: string;
  views: number;
  createdAt: string;
  thumbnailUrl: string;
  duration: string;
  channelName: string;
  channelAvatar: string;
}

// Mock related videos data
const mockRelatedVideos: VideoItem[] = [
  {
    id: 'AliveFlyWow-KEVWDJlK7Q8KpkFG',
    title: 'Amazing play during tournament',
    views: 12435,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnailUrl: 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/c9ad3c31d55b4e1c962b_nhatminh1498_39910371785_1708812115/thumb/custom-cb9f2c54-d80f-45c4-9a39-70a11abe9763-320x180.jpeg',
    duration: '0:42',
    channelName: 'ProGamer123',
    channelAvatar: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-50x50.png'
  },
  {
    id: 'BriskActiveOctopus-3QzG5DRGJkAZ',
    title: 'How to win every time with this simple trick',
    views: 7825,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnailUrl: 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/fcd1b5fab675f8d37b25_nhatminh1498_39919231753_1708902605/thumb/custom-aa34b200-10a3-4c4f-b9ad-998bbcde7ae5-320x180.jpeg',
    duration: '1:05',
    channelName: 'GameMaster',
    channelAvatar: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/ebe4cd89-b4f4-4cd9-adac-2f30151b4209-profile_image-50x50.png'
  },
  {
    id: 'CrispyDeliciousPasta-7JkPQO9Fm2',
    title: 'Speedrun world record attempt',
    views: 42105,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnailUrl: 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/fcd1b5fab675f8d37b25_nhatminh1498_39919231753_1708902605/thumb/custom-aa34b200-10a3-4c4f-b9ad-998bbcde7ae5-320x180.jpeg',
    duration: '0:58',
    channelName: 'SpeedRunner',
    channelAvatar: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/ead5c8b2-a4c9-4724-b1c9-9f9880bb9b38-profile_image-50x50.png'
  },
  {
    id: 'EnergeticHappyKoala-9KqZ2wP',
    title: 'Best clutch of the year',
    views: 31654,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnailUrl: 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/c9ad3c31d55b4e1c962b_nhatminh1498_39910371785_1708812115/thumb/custom-cb9f2c54-d80f-45c4-9a39-70a11abe9763-320x180.jpeg',
    duration: '0:37',
    channelName: 'ClutchMaster',
    channelAvatar: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/75305d54-c7cc-40d1-bb9c-91fbe85943c7-profile_image-50x50.png'
  }
];

export const RelatedVideos: React.FC<RelatedVideosProps> = ({ currentVideoId }) => {
  // Filter out the current video if it's in the related videos array
  const filteredVideos = mockRelatedVideos.filter(video => video.id !== currentVideoId);
  
  // Format view count
  const formatViews = (count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="related-videos">
      <div className="p-3 border-b border-neutral-800">
        <h3 className="font-medium text-lg">Related Clips</h3>
      </div>
      
      <div className="p-3 space-y-4">
        {filteredVideos.map(video => (
          <Link 
            key={video.id} 
            to={`/video/${video.id}`} 
            className="flex gap-3 group"
          >
            {/* Thumbnail with duration */}
            <div className="relative flex-shrink-0 w-32 h-18 bg-neutral-800 rounded overflow-hidden">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                {video.duration}
              </span>
            </div>
            
            {/* Video details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors text-start">
                {video.title}
              </h4>
              
              <div className="mt-1 flex items-center text-xs text-neutral-400">
                <span>{video.channelName}</span>
              </div>
              
              <div className="mt-1 flex items-center text-xs text-neutral-400">
                <span>{formatViews(video.views)} views</span>
                <span className="mx-1">•</span>
                <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}; 