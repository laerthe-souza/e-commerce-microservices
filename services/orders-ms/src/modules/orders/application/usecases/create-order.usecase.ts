import { Item } from '@modules/orders/domain/entities/item.entity';
import { Order } from '@modules/orders/domain/entities/order.entity';
import { IOrdersRepository } from '@modules/orders/infrastructure/repositories/contracts/orders-repository.contract';
import { OrdersRepository } from '@modules/orders/infrastructure/repositories/implementations/orders.repository';
import { ICreateOrderRequestDTO } from '@modules/orders/presentation/dtos/create-order-request.dto';
import { Inject } from '@nestjs/common';

import { EventsPublisherService } from '@infrastructure/events-publisher/services/events-publisher.service';
import { EVENTS } from '@shared/constants/events.constant';

export class CreateOrderUseCase {
  constructor(
    @Inject(OrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    @Inject(EventsPublisherService)
    private readonly eventsPublisher: EventsPublisherService,
  ) {}

  async execute(data: ICreateOrderRequestDTO): Promise<void> {
    const items = data.items.map(item => Item.create(item));

    const order = Order.create({
      customerId: data.customerId,
      items,
    });

    const createdOrder = await this.ordersRepository.insert(order);

    await this.eventsPublisher.emit(EVENTS.ORDER_CREATED.name, {
      ...createdOrder.toObject(),
      paymentMethodId: data.paymentMethodId,
    });
  }
}
