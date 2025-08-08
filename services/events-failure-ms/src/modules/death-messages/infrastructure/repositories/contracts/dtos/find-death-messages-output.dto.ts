import { DeathMessage } from '@modules/death-messages/domain/entities/death-message.entity';

export type IFindDeathMessagesOutputDTO = {
  deathMessages: DeathMessage[];
  count: number;
};
