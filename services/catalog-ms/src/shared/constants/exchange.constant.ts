import { Options } from 'amqplib';

export const EXCHANGE = {
  name: 'events_exchange',
  type: 'topic',
  options: {
    durable: true,
  } as Options.AssertExchange,
} as const;
