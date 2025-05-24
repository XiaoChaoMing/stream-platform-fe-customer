import { BaseService } from "../base/base";

interface CreatePaymentUrlRequest {
  orderId: string;
  amount: number;
  language: 'vn' | 'en';
  bankCode?: string;
}

// Since the controller redirects directly, we need to handle this differently
class PaymentService extends BaseService {
  private apiUrl: string;

  constructor() {
    super();
    this.apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  }

  /**
   * Creates a payment URL and returns the full URL
   * Note: The controller will redirect directly, so this method
   * should be used to get the URL for a form submission or direct navigation
   */
  getPaymentUrl(data: CreatePaymentUrlRequest): string {
    const { orderId, amount, language, bankCode } = data;
    const baseUrl = `${this.apiUrl}/vnpay/create-payment-url`;
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('orderId', orderId);
    params.append('amount', amount.toString());
    params.append('language', language);
    
    if (bankCode) {
      params.append('bankCode', bankCode);
    }
    
    return `${baseUrl}?${params.toString()}`;
  }
}

export const paymentService = new PaymentService();
export const getPaymentUrl = paymentService.getPaymentUrl.bind(paymentService); 