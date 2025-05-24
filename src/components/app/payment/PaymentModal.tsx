import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { usePayment } from '@/hooks/usePayment';
import { generateRandomOrderId } from '@/utils/payment';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PaymentModalProps {
  triggerButton?: React.ReactNode;
}

export function PaymentModal({ triggerButton }: PaymentModalProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [language, setLanguage] = useState<'vn' | 'en'>('vn');
  const [bankCode, setBankCode] = useState<string>('');
  const [orderId, setOrderId] = useState<string>(generateRandomOrderId());
  const [redirecting, setRedirecting] = useState(false);
  const { initiatePayment, isLoading, error } = usePayment();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const handleLanguageChange = (value: 'vn' | 'en') => {
    setLanguage(value);
  };

  const handleSubmit = () => {
    if (!amount || parseInt(amount) <= 0) {
      return;
    }
    
    setRedirecting(true);
    
    // Short timeout to show the redirecting message before actually redirecting
    setTimeout(() => {
      initiatePayment({
        amount: parseInt(amount),
        language,
      });
    }, 500);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      // Reset form when opening the modal
      setAmount('');
      setBankCode('');
      setRedirecting(false);
      // Generate a new order ID when opening the modal
      setOrderId(generateRandomOrderId());
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Payment')}</DialogTitle>
          <DialogDescription>
            {t('Enter your payment details below')}
          </DialogDescription>
        </DialogHeader>
        
        {redirecting && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">{t('Redirecting to payment gateway')}</AlertTitle>
            <AlertDescription className="text-green-700">
              {t('You will be redirected to the payment page in a moment...')}
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">{t('Payment Error')}</AlertTitle>
            <AlertDescription className="text-red-700">
              {error instanceof Error ? error.message : t('An error occurred while processing your payment')}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="gap-2 hidden">
            <Label htmlFor="orderId">{t('Order ID')}</Label>
            <Input
              id="orderId"
              value={orderId}
              readOnly
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              {t('Auto-generated order ID')}
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">{t('Amount')} (VND)</Label>
            <Input
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="50000"
              type="text"
              inputMode="numeric"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="language">{t('Language')}</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language">
                <SelectValue placeholder={t('Select language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vn">Tiếng Việt</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || redirecting || !amount || parseInt(amount) <= 0}
          >
            {isLoading || redirecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {redirecting ? t('Redirecting...') : t('Processing')}
              </>
            ) : (
              t('Proceed to Payment')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 