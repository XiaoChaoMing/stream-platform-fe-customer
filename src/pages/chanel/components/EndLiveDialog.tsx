import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/components/base/socketContext/SocketContext";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface EndLiveDialogProps {
  streamData: {
    id: string;
    title: string;
    description: string;
    stream_url: string;
  };
}

export const EndLiveDialog = ({ streamData }: EndLiveDialogProps) => {
  const { t } = useTranslation();
  const { socket } = useSocket();

  const handleEndStream = async () => {
    try {
      const endStreamData = {
        ...streamData,
        status: 'ended'
      };

      const handleSuccess = () => {
        toast.success(t('Stream ended successfully'));
        socket.off('streamEnded', handleSuccess);
        socket.off('streamError', handleError);
      };

      const handleError = (error: string) => {
        toast.error(error || t('Failed to end stream'));
        socket.off('streamEnded', handleSuccess);
        socket.off('streamError', handleError);
      };

      socket.on('streamEnded', handleSuccess);
      socket.on('streamError', handleError);

      socket.emit('endStream', endStreamData);
    } catch (error) {
      toast.error(t('Failed to end stream'));
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="ml-2 bg-red-400 hover:bg-red-600 text-white"
          title={t('End Live')}
        >
          {t('End Live')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('End Live Stream')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('Are you sure you want to end this live stream? This action cannot be undone.')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEndStream}
            className="bg-red-500 hover:bg-red-600"
          >
            {t('End Stream')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 