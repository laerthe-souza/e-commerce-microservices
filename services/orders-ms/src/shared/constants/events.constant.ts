export const EVENTS = {
  ORDER_CREATED: {
    name: 'order.created',
    consumer: false,
    producer: true,
    isActive: true,
  },
  ORDER_STATUS_UPDATED: {
    name: 'order.status.updated',
    consumer: false,
    producer: true,
    isActive: true,
  },
  PAYMENT_SUCCESS: {
    name: 'payment.success',
    consumer: true,
    producer: false,
    isActive: true,
  },
  PAYMENT_FAILED: {
    name: 'payment.failed',
    consumer: true,
    producer: false,
    isActive: true,
  },
  PAYMENT_CANCELED: {
    name: 'payment.canceled',
    consumer: true,
    producer: false,
    isActive: true,
  },
} as const;
