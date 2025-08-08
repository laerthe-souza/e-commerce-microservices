import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { EnvModule } from '@infrastructure/config/env/env.module';
import { LoggingModule } from '@infrastructure/config/logging/logging.module';
import { otelSdk } from '@infrastructure/config/otel/otel.config';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { EventsPublisherModule } from '@infrastructure/events-publisher/events-publisher.module';
import { HttpExceptionFilter } from '@infrastructure/filters/http-exception.filter';
import { HealthModule } from '@infrastructure/health/health.module';
import { QueuesModule } from '@infrastructure/queues/queues.module';

import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    EnvModule,
    LoggingModule,
    HealthModule,
    EventsPublisherModule,
    DatabaseModule,
    QueuesModule,
    OrdersModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    otelSdk.start();
  }
}
