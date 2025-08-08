import { Injectable, OnModuleInit } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';

import { EXCHANGE } from '@shared/constants/exchange.constant';

@Injectable()
export class EventsPublisherService implements OnModuleInit {
  private channel: ChannelWrapper;

  async onModuleInit() {
    const connection = amqp.connect(myEnv.RABBITMQ_URI);

    this.channel = connection.createChannel({
      json: true,
    });

    await this.channel.assertExchange(
      EXCHANGE.name,
      EXCHANGE.type,
      EXCHANGE.options,
    );
  }

  async emit<T>(routingKey: string, payload: T): Promise<boolean> {
    return this.channel.publish(
      EXCHANGE.name,
      routingKey,
      {
        pattern: routingKey,
        data: payload,
      },
      {
        headers: {
          'service-name': myEnv.SERVICE_NAME,
        },
      },
    );
  }
}
