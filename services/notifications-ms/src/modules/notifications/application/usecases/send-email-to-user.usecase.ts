import { Inject } from '@nestjs/common';

import { LoggingService } from '@infrastructure/config/logging/logging.service';
import { IEmailService } from '@infrastructure/email/contracts/email.contract';
import { EmailService } from '@infrastructure/email/implementations/email.service';

export class SendEmailToUserUseCase {
  private logger = new LoggingService(SendEmailToUserUseCase.name);

  constructor(
    @Inject(EmailService) private readonly emailService: IEmailService,
  ) {}

  async execute(order: any): Promise<void> {
    this.logger.info(`Sending email to user...`, order);

    await this.emailService.send({
      to: myEnv.RECIPIENT_EMAIL,
      subject: 'Your order status has been updated',
      content: `<h1>Order id: ${order.id}. Status: ${order.status}`,
    });
  }
}
