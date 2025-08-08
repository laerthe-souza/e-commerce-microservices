import { DeathMessagesRepository } from '@modules/death-messages/infrastructure/repositories/implementations/death-messages.repository';
import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaService, DeathMessagesRepository],
  exports: [PrismaService, DeathMessagesRepository],
})
export class DatabaseModule {}
