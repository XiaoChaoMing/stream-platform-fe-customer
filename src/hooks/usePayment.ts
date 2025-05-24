import { useState } from 'react';
import { getPaymentUrl } from '@/services/app/payment';
import { generateRandomOrderId } from '@/utils/payment';

interface PaymentFormData {
  amount: number;
  language: 'vn' | 'en';
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initiatePayment = (data: PaymentFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const orderId = generateRandomOrderId();
      
      // Get the full payment URL
      const paymentUrl = getPaymentUrl({
        orderId,
        amount: data.amount,
        language: data.language,
      });
      
      // Navigate to the payment URL - the controller will handle the redirect
      window.location.href = paymentUrl;
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initiate payment'));
      setIsLoading(false);
    }
  };

  return {
    initiatePayment,
    isLoading,
    error
  };
}; 