import { DeathMessage } from '@modules/death-messages/domain/entities/death-message.entity';

import { IFindDeathMessagesInputDTO } from './dtos/find-death-messages-input.dto';
import { IFindDeathMessagesOutputDTO } from './dtos/find-death-messages-output.dto';

export interface IDeathMessagesRepository {
  insert(data: DeathMessage): Promise<DeathMessage>;
  save(data: DeathMessage): Promise<DeathMessage>;
  find(
    query?: IFindDeathMessagesInputDTO,
  ): Promise<IFindDeathMessagesOutputDTO>;
  findById(id: string): Promise<DeathMessage | null>;
}
