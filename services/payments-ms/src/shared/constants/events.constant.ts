export const EVENTS = {
  ORDER_CREATED: {
    name: 'order.created',
    consumer: true,
    producer: false,
    isActive: true,
  },
  SUBSCRIPTION_CREATED: {
    name: 'subscription.created',
    consumer: true,
    producer: false,
    isActive: true,
  },
  PAYMENT_SUCCESS: {
    name: 'payment.success',
    consumer: false,
    producer: true,
    isActive: true,
  },
} as const;
