export const EVENTS = {
  PRODUCT_CREATED: {
    name: 'product.created',
    consumer: false,
    producer: true,
    isActive: true,
  },
  PRODUCT_UPDATED: {
    name: 'product.updated',
    consumer: false,
    producer: true,
    isActive: true,
  },
  PAYMENT_PRODUCT_CREATED: {
    name: 'payment.product.created',
    consumer: true,
    producer: false,
    isActive: true,
  },
} as const;
