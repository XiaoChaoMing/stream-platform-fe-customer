import { useChannelStore } from "@/store/slices/channelSlice";
import { Button } from "@/components/ui/button";
import { Calendar, Edit3 } from "lucide-react";
import { useChannelQuery } from "@/hooks/useChannelQuery";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Schedule() {
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

  if (isLoading) {
    return <div className="text-foreground p-4">{t('common.loading.schedule')}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">{t('channel.schedule')}</h1>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground text-xl font-semibold">{t('channel.upcomingStreams')}</h2>
        {isEditingMode && isOwnChannel && (
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Edit3 className="h-4 w-4 mr-2" />
            {t('channel.editSchedule')}
          </Button>
        )}
      </div>
      
      <div className="bg-card rounded-md p-6">
        <div className="flex items-center mb-4">
          <Calendar className="h-6 w-6 mr-3 text-accent" />
          <h3 className="text-foreground text-lg font-medium">{t('channel.regularSchedule')}</h3>
        </div>
        
        <div className="space-y-4">
          {channelData.schedule.days.map((day, index) => (
            <div key={index} className="flex items-center p-3 border-b border-border last:border-0">
              <div className="w-32 font-medium text-foreground">{day}</div>
              <div className="text-muted-foreground">
                {channelData.schedule.startTime} - {channelData.schedule.endTime} {channelData.schedule.timezone}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-muted-foreground text-sm">
          <p>{t('channel.timezoneInfo', { timezone: channelData.schedule.timezone })}</p>
          <p>{t('channel.scheduleDisclaimer', { name: channelData.displayName })}</p>
        </div>
      </div>
    </div>
  );
}
