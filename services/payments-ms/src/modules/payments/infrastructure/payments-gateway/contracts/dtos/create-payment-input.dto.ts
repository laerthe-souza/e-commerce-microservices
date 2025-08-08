export type ICreatePaymentInputDTO = {
  currency: string;
  amount: number;
  customerId: string;
  paymentMethodId: string;
  metadata?: Record<string, string | number>;
};
