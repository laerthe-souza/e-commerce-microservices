export const EVENTS = {
  ORDER_STATUS_UPDATED: {
    name: 'order.status.updated',
    consumer: true,
    producer: false,
    isActive: true,
  },
} as const;
