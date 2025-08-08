import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { EXCHANGE } from '@shared/constants/exchange.constant';
import { QUEUE } from '@shared/constants/queue.constant';
import { gracefulShutdown } from '@shared/helpers/graceful-shutdown.helper';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(Logger);

  app.useLogger(logger);
  app.use(helmet());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.enableShutdownHooks();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [myEnv.RABBITMQ_URI],
      exchange: EXCHANGE.name,
      exchangeType: EXCHANGE.type,
      persistent: true,
      noAck: false,
      queue: QUEUE.name,
      queueOptions: QUEUE.options,
    },
  });

  await app.startAllMicroservices();
  await app.listen(myEnv.PORT, () =>
    logger.log(
      `[${process.pid}] - Server is running on port ${myEnv.PORT}`,
      'NestApplication',
    ),
  );

  process.on('unhandledRejection', reason => {
    logger.error(`Unhandled rejection - reason: ${reason as string}`);
  });

  process.on('uncaughtException', error => {
    logger.error({
      msg: `Uncaught exception:`,
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    });
  });

  process.on('SIGTERM', gracefulShutdown(app));
  process.on('SIGINT', gracefulShutdown(app));
}

void bootstrap();
