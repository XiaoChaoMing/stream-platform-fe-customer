import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPen } from 'lucide-react';
import { ProfileUpdateForm } from '@/components/app/profile/ProfileUpdateForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/useStore';

interface EditModalProps {
  profileId: string | number;
  triggerButton?: React.ReactNode;
}

export function EditModal({ profileId, triggerButton }: EditModalProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { user } = useStore();

  // Close the dialog
  const handleDialogChange = (open: boolean) => {
    setOpen(open);
  };

  // Handle successful profile update
  const handleProfileUpdateSuccess = () => {
    // Close the modal after a short delay to show the success message
    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  // Use the user_id from the store or fall back to 0
  const userId = user?.user_id ? parseInt(user.user_id) : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button 
            variant="ghost" 
            className="ml-2 bg-secondary hover:bg-secondary/90 text-foreground"
            title={t('Edit Profile')}
          >
            <UserPen className="h-4 w-4 mr-2" />
            {t('Edit Profile')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('Edit Profile')}</DialogTitle>
          <DialogDescription>
            {t('Update your profile information below')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ProfileUpdateForm 
            userId={userId}
            profileId={profileId}
            onSuccess={handleProfileUpdateSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
