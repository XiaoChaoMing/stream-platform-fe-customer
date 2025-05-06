import { useChannelStore } from "@/store/slices/channelSlice";
import { Button } from "@/components/ui/button";
import { Edit3, PlusCircle } from "lucide-react";
import { useChannelQuery } from "@/hooks/useChannelQuery";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Video() {
  const { username } = useParams<{ username: string }>();
  const { t } = useTranslation();
  
  // Initialize the query but without triggering data fetch as it will be handled by the parent Channel component
  const {videosLoading } = useChannelQuery(username);
  
  // Get data from Zustand store
  const { 
    currentChannel: channelData, 
    isLoading, 
    isOwnChannel 
  } = useChannelStore();

  if (isLoading || videosLoading) {
    return <div className="text-foreground p-4">Loading videos...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground text-start">{t('channel.videos')}</h1>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground text-xl font-semibold">{t('channel.videos')}</h2>
        {isOwnChannel && (
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="h-4 w-4 mr-2" />
            Upload Video
          </Button>
        )}
      </div>
      
      {/* Video Categories */}
      <div className="flex overflow-x-auto mb-4 space-x-2">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap">All Videos</Button>
        <Button variant="ghost" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap">Recent Broadcasts</Button>
        <Button variant="ghost" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap">Clips</Button>
        <Button variant="ghost" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap">Highlights</Button>
        <Button variant="ghost" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap">Collections</Button>
        {isOwnChannel && (
          <Button variant="ghost" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        )}
      </div>
      
      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {channelData.videos.map(video => (
          <div key={video.id} className="bg-card rounded-md overflow-hidden transition-transform hover:translate-y-[-4px] cursor-pointer relative">
            {isOwnChannel && (
              <div className="absolute top-2 right-2 z-10 flex space-x-2">
                <Button className="h-8 w-8 p-0 bg-secondary/70 hover:bg-secondary/90 rounded-full">
                  <Edit3 className="h-4 w-4 text-secondary-foreground" />
                </Button>
              </div>
            )}
            <div className="relative">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-secondary/80 text-secondary-foreground px-1 rounded text-xs py-0.5">
                {video.duration}
              </div>
              {video.type === 'clip' && (
                <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-1 rounded text-xs py-0.5">
                  CLIP
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-foreground font-medium text-sm line-clamp-2">{video.title}</h3>
              <div className="text-muted-foreground text-xs mt-1">
                {video.views.toLocaleString()} {t('channel.views')} • {video.createdAt}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {channelData.videos.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-foreground text-lg">No videos found</h3>
          <p className="text-muted-foreground mt-2">This channel hasn't uploaded any videos yet.</p>
        </div>
      )}
    </div>
  );
}
