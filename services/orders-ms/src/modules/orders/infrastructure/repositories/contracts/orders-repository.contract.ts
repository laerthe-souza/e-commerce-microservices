import { Order } from '@modules/orders/domain/entities/order.entity';

import { IFindOrdersInputDTO } from './dtos/find-orders-input.dto';
import { IFindOrdersOutputDTO } from './dtos/find-orders-output.dto';

export interface IOrdersRepository {
  insert(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<Order>;
  find(query?: IFindOrdersInputDTO): Promise<IFindOrdersOutputDTO>;
}
