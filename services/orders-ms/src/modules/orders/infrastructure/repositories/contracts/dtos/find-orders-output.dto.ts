import { Order } from '@modules/orders/domain/entities/order.entity';

export type IFindOrdersOutputDTO = {
  orders: Order[];
  count: number;
};
