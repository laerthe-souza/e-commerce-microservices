export type ICreateSubscriptionInputDTO = {
  currency: string;
  priceId: string;
  customerId: string;
  paymentMethodId: string;
  metadata?: Record<string, string | number>;
};
