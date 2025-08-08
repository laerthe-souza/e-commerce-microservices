import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';

import { LoggingService } from '@infrastructure/config/logging/logging.service';

import { ISendEmailInputDTO } from '../contracts/dtos/send-email-input.dto';
import { IEmailService } from '../contracts/email.contract';

@Injectable()
export class EmailService implements IEmailService {
  private logger = new LoggingService(EmailService.name);
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: myEnv.AWS_ACCESS_KEY_ID,
        secretAccessKey: myEnv.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async send({ to, subject, content }: ISendEmailInputDTO) {
    const command = new SendEmailCommand({
      Source: myEnv.SOURCE_EMAIL,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: content,
            Charset: 'UTF-8',
          },
        },
      },
    });

    const result = await this.sesClient.send(command);

    this.logger.info(
      `[${result.MessageId}] - Email send successfully`,
      result.$metadata,
    );
  }
}
