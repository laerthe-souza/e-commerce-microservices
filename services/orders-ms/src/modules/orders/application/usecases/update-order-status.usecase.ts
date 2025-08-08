import { IOrdersRepository } from '@modules/orders/infrastructure/repositories/contracts/orders-repository.contract';
import { OrdersRepository } from '@modules/orders/infrastructure/repositories/implementations/orders.repository';
import { IUpdateOrderStatusRequestDTO } from '@modules/orders/presentation/dtos/update-order-status-request.dto';
import { Inject } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

import { EventsPublisherService } from '@infrastructure/events-publisher/services/events-publisher.service';
import { EVENTS } from '@shared/constants/events.constant';

export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(OrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    @Inject(EventsPublisherService)
    private readonly eventsPublisher: EventsPublisherService,
  ) {}

  async execute(data: IUpdateOrderStatusRequestDTO): Promise<void> {
    const order = await this.ordersRepository.findById(data.id);

    if (!order) {
      throw new Error('Order does not exists');
    }

    if (data.status === OrderStatus.approved && data.transactionId) {
      order.approve(data.transactionId);
    }

    if (data.status === OrderStatus.canceled) {
      order.cancel();
    }

    if (data.status === OrderStatus.failed) {
      order.fail();
    }

    const updatedOrder = await this.ordersRepository.save(order);

    await this.eventsPublisher.emit(
      EVENTS.ORDER_STATUS_UPDATED.name,
      updatedOrder.toObject(),
    );
  }
}
