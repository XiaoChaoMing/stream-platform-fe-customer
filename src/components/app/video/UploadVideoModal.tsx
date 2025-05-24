import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { UploadVideoForm } from './UploadVideoForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

interface UploadVideoModalProps {
  triggerButton?: React.ReactNode;
  onSuccess?: () => void;
}

export function UploadVideoModal({ triggerButton, onSuccess }: UploadVideoModalProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // Close the dialog
  const handleDialogChange = (open: boolean) => {
    setOpen(open);
  };

  // Handle successful video upload
  const handleUploadSuccess = () => {
    // Close the modal after a short delay to show the success message
    setTimeout(() => {
      setOpen(false);
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button 
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            {t('Upload Video')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('Upload Video')}</DialogTitle>
          <DialogDescription>
            {t('Share your video with your followers')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <UploadVideoForm onSuccess={handleUploadSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 