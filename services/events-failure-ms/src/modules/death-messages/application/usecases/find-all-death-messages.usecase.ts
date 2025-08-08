import { DeathMessage } from '@modules/death-messages/domain/entities/death-message.entity';
import { IDeathMessagesRepository } from '@modules/death-messages/infrastructure/repositories/contracts/death-messages.repository';
import { DeathMessagesRepository } from '@modules/death-messages/infrastructure/repositories/implementations/death-messages.repository';
import { IFindAllDeathMessagesRequestDTO } from '@modules/death-messages/presentation/dtos/find-all-death-messages-request.dto';
import { Inject } from '@nestjs/common';

type IResponse = {
  deathMessages: ReturnType<DeathMessage['toObject']>[];
  count: number;
};

export class FindAllDeathMessagesUseCase {
  constructor(
    @Inject(DeathMessagesRepository)
    private readonly deathMessagesRepository: IDeathMessagesRepository,
  ) {}

  async execute(query?: IFindAllDeathMessagesRequestDTO): Promise<IResponse> {
    return this.deathMessagesRepository.find(query);
  }
}
