import { Module } from '@nestjs/common';

import { SendEmailToUserUseCase } from './application/usecases/send-email-to-user.usecase';
import { NotificationsController } from './presentation/notifications.controller';

@Module({
  controllers: [NotificationsController],
  providers: [SendEmailToUserUseCase],
})
export class NotificationsModule {}
