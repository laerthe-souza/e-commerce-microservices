import { RmqContext } from '@nestjs/microservices';
import { ChannelWrapper } from 'amqp-connection-manager';
import { Message } from 'amqplib';

import { LoggingService } from '@infrastructure/config/logging/logging.service';

export function eventHandlerTryCatch(
  handlerFn: (data: any, context: RmqContext) => Promise<void>,
) {
  const logger = new LoggingService(eventHandlerTryCatch.name);

  return async (data: any, context: RmqContext) => {
    const channel = context.getChannelRef() as ChannelWrapper;
    const message = context.getMessage() as Message;

    try {
      await handlerFn(data, context);

      return channel.ack(message);
    } catch (error) {
      logger.error(`Error when process this event`, {
        error: error.message,
        request: error.response?.data,
        code: error.code,
        cause: error.cause,
        stack: error.stack,
      });

      return channel.nack(message, undefined, false);
    }
  };
}
