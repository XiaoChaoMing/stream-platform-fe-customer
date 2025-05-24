import { Stream } from "@/types/category";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface StreamCardProps {
  stream: Stream;
}

export const StreamCard = ({ stream }: StreamCardProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="group relative overflow-hidden rounded-md">
        <Link to={`/watching/${stream.id}`} className="relative block">
          <img 
            src={stream.thumbnailUrl} 
            alt={stream.title} 
            className="h-[248px] w-[440px] object-cover transition-transform duration-300 group-hover:scale-105" 
          />
          {stream.isLive && (
            <div className="absolute bottom-2 left-2 rounded bg-red-600 px-1 py-0.5 text-xs font-medium text-white">
              LIVE
            </div>
          )}
          <div className="absolute bottom-2 right-2 text-white text-xs font-medium">
            {stream.viewerCount.toLocaleString()} viewers
          </div>
        </Link>
      </div>
      <div className="flex gap-2">
        <Link to={`/chanel/${stream.user.username}`}>
          <img 
            src={stream.user.avatarUrl} 
            alt={stream.user.displayName} 
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>
        <div className="flex flex-col">
          <Link 
            to={`/watching/${stream.id}`}
            className="line-clamp-1 font-semibold text-base hover:text-purple-500 transition-colors"
          >
            {stream.title}
          </Link>
          <Link 
            to={`/chanel/${stream.user.username}`}
            className="text-sm text-gray-500 hover:text-purple-500 transition-colors flex items-center gap-1"
          >
            {stream.user.displayName}
            {stream.user.isVerified && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-purple-500">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            )}
          </Link>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              {stream.language}
            </Badge>
            {stream.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamCard; 