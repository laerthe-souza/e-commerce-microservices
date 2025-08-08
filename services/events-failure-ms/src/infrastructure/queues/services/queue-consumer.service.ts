import { SaveDeathMessageUseCase } from '@modules/death-messages/application/usecases/save-death-message.usecase';
import { IDeathMessagesRepository } from '@modules/death-messages/infrastructure/repositories/contracts/death-messages.repository';
import { DeathMessagesRepository } from '@modules/death-messages/infrastructure/repositories/implementations/death-messages.repository';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Channel, connect } from 'amqp-connection-manager';
import { MessagePropertyHeaders } from 'amqplib';
import { setTimeout } from 'node:timers/promises';

import { LoggingService } from '@infrastructure/config/logging/logging.service';
import { QUEUE } from '@shared/constants/queue.constant';

@Injectable()
export class QueueConsumerService implements OnApplicationBootstrap {
  private logger = new LoggingService(QueueConsumerService.name);

  constructor(
    @Inject(DeathMessagesRepository)
    private readonly deathMessagesRepository: IDeathMessagesRepository,
  ) {}

  async onApplicationBootstrap() {
    const rabbit = connect(myEnv.RABBITMQ_URI);

    await rabbit.connect();

    const channel = rabbit.createChannel({
      name: `${myEnv.SERVICE_NAME}-channel`,
      json: true,
      setup: (ch: Channel) => {
        return ch.prefetch(100);
      },
    });

    await channel.waitForConnect();

    const saveDeathMessage = new SaveDeathMessageUseCase(
      this.deathMessagesRepository,
    );

    await channel.consume(QUEUE.name, async queuedMessage => {
      if (!queuedMessage) {
        return;
      }

      try {
        if (queuedMessage.properties.headers) {
          const { headers } = queuedMessage.properties;

          const {
            'x-retry-count': retryCount = 0,
            'x-last-death-queue': originalQueue,
          } = headers;

          if (originalQueue && retryCount < 5) {
            const nextRetryCount = retryCount + 1;

            const jitterInMs = Math.random() * 500;
            const backoffInMs = Math.min(
              10000,
              250 * Math.pow(2, nextRetryCount),
            );

            this.logger.warn(
              `Processing this message again, retrying in ${backoffInMs + jitterInMs}...`,
              {
                fields: queuedMessage.fields,
                headers: headers,
              },
            );

            await setTimeout(backoffInMs + jitterInMs);

            const headersToForward = Object.entries(headers)
              .filter(([key]) => !key.includes('death'))
              .reduce((acc, [key, value]) => {
                acc[key] = value;

                return acc;
              }, {} as MessagePropertyHeaders);

            const queuedContent = JSON.parse(queuedMessage.content.toString());

            await channel.sendToQueue(originalQueue, queuedContent, {
              persistent: true,
              expiration: 1000 * 60 * 5, // 5 minutes
              headers: {
                ...headersToForward,
                'x-retry-count': nextRetryCount,
              },
            });

            return channel.ack(queuedMessage);
          }
        }

        await saveDeathMessage.execute(queuedMessage);

        channel.ack(queuedMessage);
      } catch (error) {
        this.logger.error(`Error when consume this queue`, {
          error: error.message,
          request: error.response?.data,
          code: error.code,
          cause: error.cause,
          stack: error.stack,
        });

        await setTimeout(2000);

        channel.nack(queuedMessage, undefined, true);
      }
    });

    this.logger.info(`[✔] Consumer for queue ${QUEUE.name} is running...`);
  }
}
