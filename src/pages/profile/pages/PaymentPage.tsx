import { useTranslation } from 'react-i18next';

export default function PaymentPage() {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('Payment Settings')}</h1>
        <div className="bg-card rounded-lg p-6">
          <p>{t('Payment settings will be available soon.')}</p>
        </div>
      </div>
    </div>
  );
}
