import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { LoggingService } from '@infrastructure/config/logging/logging.service';
import { EVENTS } from '@shared/constants/events.constant';
import { eventHandlerTryCatch } from '@shared/helpers/events-handler-try-catch.helper';

import { SendEmailToUserUseCase } from '../application/usecases/send-email-to-user.usecase';

@Controller('notifications')
export class NotificationsController {
  private logger = new LoggingService(NotificationsController.name);

  constructor(private readonly sendEmailToUser: SendEmailToUserUseCase) {}

  @EventPattern(EVENTS.ORDER_STATUS_UPDATED.name)
  notify(@Payload() data: any, @Ctx() ctx: RmqContext) {
    return eventHandlerTryCatch(async payload => {
      this.logger.info(
        `[${payload.id}] - Order status updated: ${payload.status}`,
      );

      return this.sendEmailToUser.execute(payload);
    })(data, ctx);
  }
}
