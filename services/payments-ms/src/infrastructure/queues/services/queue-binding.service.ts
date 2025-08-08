import { Injectable, OnModuleInit } from '@nestjs/common';
import amqp from 'amqplib';

import { LoggingService } from '@infrastructure/config/logging/logging.service';
import { EVENTS } from '@shared/constants/events.constant';
import { EXCHANGE } from '@shared/constants/exchange.constant';
import { QUEUE } from '@shared/constants/queue.constant';

@Injectable()
export class QueueBindingService implements OnModuleInit {
  private logger = new LoggingService(QueueBindingService.name);

  async onModuleInit() {
    const connection = await amqp.connect(myEnv.RABBITMQ_URI);
    const channel = await connection.createChannel();

    await channel.assertExchange(
      EXCHANGE.name,
      EXCHANGE.type,
      EXCHANGE.options,
    );

    await channel.assertQueue(QUEUE.name, QUEUE.options);

    await Promise.all(
      Object.values(EVENTS)
        .filter(event => event.consumer)
        .map(async event => {
          if (event.isActive) {
            await channel.bindQueue(QUEUE.name, EXCHANGE.name, event.name);

            this.logger.info(
              `[✔] Bound ${QUEUE.name} to ${EXCHANGE.name} with key: ${event.name}`,
            );
          } else {
            await channel.unbindQueue(QUEUE.name, EXCHANGE.name, event.name);

            this.logger.info(
              `[✔] Unbound ${QUEUE.name} to ${EXCHANGE.name} with key: ${event.name}`,
            );
          }
        }),
    );

    await channel.close();
    await connection.close();
  }
}
