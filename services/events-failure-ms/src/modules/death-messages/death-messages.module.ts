import { Module } from '@nestjs/common';

import { FindAllDeathMessagesUseCase } from './application/usecases/find-all-death-messages.usecase';
import { ResendDeathMessagesUseCase } from './application/usecases/resend-death-message.usecase';
import { SaveDeathMessageUseCase } from './application/usecases/save-death-message.usecase';
import { DeathMessagesController } from './presentation/death-messages.controller';

@Module({
  controllers: [DeathMessagesController],
  providers: [
    ResendDeathMessagesUseCase,
    SaveDeathMessageUseCase,
    FindAllDeathMessagesUseCase,
  ],
})
export class DeathMessagesModule {}
