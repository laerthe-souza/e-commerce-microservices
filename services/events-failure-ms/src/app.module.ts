import { DeathMessagesModule } from '@modules/death-messages/death-messages.module';
import { Module, OnApplicationBootstrap } from '@nestjs/common';

import { EnvModule } from '@infrastructure/config/env/env.module';
import { LoggingModule } from '@infrastructure/config/logging/logging.module';
import { otelSdk } from '@infrastructure/config/otel/otel.config';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { HealthModule } from '@infrastructure/health/health.module';
import { QueuesModule } from '@infrastructure/queues/queues.module';

@Module({
  imports: [
    EnvModule,
    LoggingModule,
    HealthModule,
    DatabaseModule,
    QueuesModule,
    DeathMessagesModule,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    otelSdk.start();
  }
}
