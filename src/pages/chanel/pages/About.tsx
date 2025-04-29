import { useChannelStore } from "@/store/slices/channelSlice";
import { Button } from "@/components/ui/button";
import { Edit3, PlusCircle } from "lucide-react";
import { useChannelQuery } from "@/hooks/useChannelQuery";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function About() {
  const { username } = useParams<{ username: string }>();
  const { t } = useTranslation();
  
  // Initialize the query but without triggering data fetch as it will be handled by the parent Channel component
  useChannelQuery(username);
  
  // Get data from Zustand store
  const { 
    currentChannel: channelData, 
    isLoading, 
    isEditingMode, 
    isOwnChannel 
  } = useChannelStore();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t('channel.about')}</h1>
      
      {isLoading ? (
        <p className="text-foreground">Loading channel information...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-foreground text-xl font-semibold">{t('channel.aboutPrefix')} {channelData.displayName}</h2>
              {isEditingMode && isOwnChannel && (
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Edit3 className="h-4 w-4 mr-2" />
                  {t('channel.editBio')}
                </Button>
              )}
            </div>
            <div className="bg-card rounded-md p-4">
              <p className="text-muted-foreground whitespace-pre-line">{channelData.description}</p>
            </div>
            
            {/* Panels */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground text-xl font-semibold">{t('channel.panels')}</h2>
                {isEditingMode && isOwnChannel && (
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {t('channel.addPanel')}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {channelData.panels.map(panel => (
                  <div key={panel.id} className="bg-card rounded-md overflow-hidden relative">
                    {isEditingMode && isOwnChannel && (
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Button className="h-8 w-8 p-0 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full">
                          <Edit3 className="h-4 w-4 text-foreground" />
                        </Button>
                      </div>
                    )}
                    {panel.imageUrl && panel.link && (
                      <a href={panel.link} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={panel.imageUrl} 
                          alt={panel.title}
                          className="w-full h-auto"
                        />
                      </a>
                    )}
                    {panel.content && (
                      <div className="p-4">
                        {panel.title && <h4 className="text-foreground font-semibold mb-2">{panel.title}</h4>}
                        <p className="text-muted-foreground whitespace-pre-line">{panel.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h2 className="text-foreground text-xl font-semibold mb-4">{t('channel.info')}</h2>
            <div className="bg-card rounded-md p-4">
              <div className="mb-4">
                <div className="text-muted-foreground mb-1">{t('channel.followers')}</div>
                <div className="text-foreground font-medium">{channelData.followers}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-muted-foreground mb-1">{t('channel.socialMedia')}</div>
                <div className="flex gap-3">
                  {channelData.socialLinks.twitter && (
                    <a href={channelData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <svg className="h-5 w-5 text-muted-foreground hover:text-accent" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.014-.627.961-.69 1.8-1.56 2.46-2.548l-.047-.02z"/>
                      </svg>
                    </a>
                  )}
                  {channelData.socialLinks.youtube && (
                    <a href={channelData.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                      <svg className="h-5 w-5 text-muted-foreground hover:text-accent" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  )}
                  {channelData.socialLinks.instagram && (
                    <a href={channelData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <svg className="h-5 w-5 text-muted-foreground hover:text-accent" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                      </svg>
                    </a>
                  )}
                  {channelData.socialLinks.discord && (
                    <a href={channelData.socialLinks.discord} target="_blank" rel="noopener noreferrer">
                      <svg className="h-5 w-5 text-muted-foreground hover:text-accent" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.198.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground mb-1">{t('channel.schedule')}</div>
                  {isEditingMode && isOwnChannel && (
                    <Button variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="text-foreground">
                  {channelData.schedule.days.join(', ')}
                  <br />
                  {channelData.schedule.startTime} - {channelData.schedule.endTime} {channelData.schedule.timezone}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
