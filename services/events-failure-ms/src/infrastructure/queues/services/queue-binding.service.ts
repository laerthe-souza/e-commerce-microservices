import { Injectable, OnModuleInit } from '@nestjs/common';
import amqp from 'amqplib';

import { LoggingService } from '@infrastructure/config/logging/logging.service';
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

    await channel.bindQueue(QUEUE.name, EXCHANGE.name, '');

    this.logger.info(`[✔] Bound ${QUEUE.name} to ${EXCHANGE.name}`);

    await channel.close();
    await connection.close();
  }
}
