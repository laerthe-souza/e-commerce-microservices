import { DeathMessage } from '@modules/death-messages/domain/entities/death-message.entity';
import { IDeathMessagesRepository } from '@modules/death-messages/infrastructure/repositories/contracts/death-messages.repository';
import { DeathMessagesRepository } from '@modules/death-messages/infrastructure/repositories/implementations/death-messages.repository';
import { Inject } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';

import { LoggingService } from '@infrastructure/config/logging/logging.service';
import { IDeathMessageStatus } from '@shared/enums/death-message-status.enum';
import { getTraceId } from '@shared/helpers/get-trace-id.helper';

export class SaveDeathMessageUseCase {
  private logger = new LoggingService(SaveDeathMessageUseCase.name);

  constructor(
    @Inject(DeathMessagesRepository)
    private readonly deathMessagesRepository: IDeathMessagesRepository,
  ) {}

  async execute({ content, fields, properties }: ConsumeMessage) {
    this.logger.warn(`[${fields.routingKey}] - Saving dlq queue message...`, {
      properties,
      fields,
    });

    const { 'service-name': serviceName, 'death-message-id': deathMessageId } =
      properties.headers as Record<string, string>;

    if (deathMessageId) {
      const deathMessage =
        await this.deathMessagesRepository.findById(deathMessageId);

      if (deathMessage) {
        deathMessage.updateStatus(IDeathMessageStatus.error);

        return this.deathMessagesRepository.save(deathMessage);
      }
    }

    const createdDeathMessage = DeathMessage.create({
      content: JSON.stringify(content),
      exchange: fields.exchange,
      serviceName,
      reason: properties.headers?.['x-first-death-reason'] ?? 'unknown',
      routingKey: fields.routingKey,
      traceId: getTraceId(),
    });

    return this.deathMessagesRepository.insert(createdDeathMessage);
  }
}
