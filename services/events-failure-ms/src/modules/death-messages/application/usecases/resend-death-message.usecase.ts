import { IDeathMessagesRepository } from '@modules/death-messages/infrastructure/repositories/contracts/death-messages.repository';
import { DeathMessagesRepository } from '@modules/death-messages/infrastructure/repositories/implementations/death-messages.repository';
import { Inject } from '@nestjs/common';

import { IDeathMessageStatus } from '@shared/enums/death-message-status.enum';

export class ResendDeathMessagesUseCase {
  constructor(
    @Inject(DeathMessagesRepository)
    private readonly deathMessagesRepository: IDeathMessagesRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const deathMessage = await this.deathMessagesRepository.findById(id);

    if (!deathMessage) {
      throw new Error('Death does not exists');
    }

    deathMessage.updateStatus(IDeathMessageStatus.processing);

    await this.deathMessagesRepository.save(deathMessage);

    // return this.queuesProvider.publishInQueue({
    //   content: deathMessage.getMessage,
    //   integrationType: integration.getContent.type,
    //   routingKey: deathMessage.getContent.routingKey,
    //   headers: {
    //     'external-id': externalId,
    //     'death-message-id': deathMessage.getContent.id,
    //   },
    // });
  }
}
