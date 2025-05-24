import { useTranslation } from 'react-i18next';

export default function AccountPage() {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('Account Settings')}</h1>
        <div className="bg-card rounded-lg p-6">
          <p>{t('Account settings will be available soon.')}</p>
        </div>
      </div>
    </div>
  );
}
