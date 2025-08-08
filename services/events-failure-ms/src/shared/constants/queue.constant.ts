import { Options } from 'amqplib';

export const QUEUE = {
  name: 'events-failure-ms_queue',
  options: {
    durable: true,
  } as Options.AssertQueue,
} as const;
