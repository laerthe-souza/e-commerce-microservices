import { Order } from '@modules/orders/domain/entities/order.entity';
import { IOrdersRepository } from '@modules/orders/infrastructure/repositories/contracts/orders-repository.contract';
import { OrdersRepository } from '@modules/orders/infrastructure/repositories/implementations/orders.repository';
import { IFindAllOrdersRequestDTO } from '@modules/orders/presentation/dtos/find-all-orders-request.dto';
import { Inject } from '@nestjs/common';

type IResponse = {
  orders: ReturnType<Order['toObject']>[];
  count: number;
};

export class FindAllOrdersUseCase {
  constructor(
    @Inject(OrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  async execute(query: IFindAllOrdersRequestDTO): Promise<IResponse> {
    const { orders, count } = await this.ordersRepository.find(query);

    return {
      orders: orders.map(order => order.toObject()),
      count,
    };
  }
}
