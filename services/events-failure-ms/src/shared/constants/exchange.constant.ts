import { Options } from 'amqplib';

export const EXCHANGE = {
  name: 'events-failure-ms_exchange',
  type: 'fanout',
  options: {
    durable: true,
  } as Options.AssertExchange,
} as const;
