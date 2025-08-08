import { OrderStatus } from '@prisma/client';

export type IFindOrdersInputDTO = {
  page?: number;
  take?: number;
  customerId?: string;
  transactionId?: string;
  status?: OrderStatus;
};
