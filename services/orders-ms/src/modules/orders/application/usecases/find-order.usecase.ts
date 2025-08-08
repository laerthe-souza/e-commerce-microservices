import { Order } from '@modules/orders/domain/entities/order.entity';
import { IOrdersRepository } from '@modules/orders/infrastructure/repositories/contracts/orders-repository.contract';
import { OrdersRepository } from '@modules/orders/infrastructure/repositories/implementations/orders.repository';
import { Inject } from '@nestjs/common';

export class FindOrderUseCase {
  constructor(
    @Inject(OrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  async execute(id: string): Promise<ReturnType<Order['toObject']>> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new Error('Order does not exists');
    }

    return order.toObject();
  }
}
