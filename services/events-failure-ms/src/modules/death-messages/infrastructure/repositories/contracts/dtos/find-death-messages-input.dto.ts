import { IDeathMessageStatus } from '@shared/enums/death-message-status.enum';

export type IFindDeathMessagesInputDTO = {
  page?: number;
  take?: number;
  serviceName?: string;
  traceId?: string;
  status?: IDeathMessageStatus;
};
