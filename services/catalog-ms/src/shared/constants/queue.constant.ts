import { Options } from 'amqplib';

export const QUEUE = {
  name: 'catalog-ms_queue',
  options: {
    durable: true,
    deadLetterExchange: 'events-failure-ms_exchange',
  } as Options.AssertQueue,
} as const;
