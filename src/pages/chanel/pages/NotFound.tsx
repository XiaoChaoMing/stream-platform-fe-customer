import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold text-foreground">{t('error.404Title')}</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        {t('error.404Description')}
      </p>
      <Button 
        onClick={() => navigate("/channel")}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {t('common.navigation.returnToChannelList')}
      </Button>
    </div>
  );
}
