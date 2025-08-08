import {
  BeforeApplicationShutdown,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { LoggingService } from '@infrastructure/config/logging/logging.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, BeforeApplicationShutdown
{
  private logger = new LoggingService(PrismaService.name);

  async onModuleInit() {
    await this.$connect();

    this.logger.info('Postgres database connected');
  }

  async beforeApplicationShutdown() {
    await this.$disconnect();

    this.logger.warn(`Postgres database disconnected`);
  }
}
