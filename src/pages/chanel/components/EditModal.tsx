import { UserPen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface EditModalProps {
  profileId: string | number;
  triggerButton?: React.ReactNode;
}

export function EditModal({ profileId, triggerButton }: EditModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleEditProfile = () => {
    navigate('/profile');
  };

  return (
    <>
      {triggerButton ? (
        <div onClick={handleEditProfile}>
          {triggerButton}
        </div>
      ) : (
        <Button 
          variant="ghost" 
          className="ml-2 bg-secondary hover:bg-secondary/90 text-foreground"
          title={t('Edit Profile')}
          onClick={handleEditProfile}
        >
          <UserPen className="h-4 w-4 mr-2" />
          {t('Edit Profile')}
        </Button>
      )}
    </>
  );
}
