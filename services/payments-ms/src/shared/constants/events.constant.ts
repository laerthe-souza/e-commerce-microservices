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
  PAYMENT_PRODUCT_CREATED: {
    name: 'payment.product.created',
    consumer: false,
    producer: true,
    isActive: true,
  },
  PRODUCT_CREATED: {
    name: 'product.created',
    consumer: true,
    producer: false,
    isActive: true,
  },
  PRODUCT_UPDATED: {
    name: 'product.updated',
    consumer: true,
    producer: false,
    isActive: true,
  },
} as const;
