import { Order } from '../entities/order.entity';

export class OrderStatusUpdatedEvent {
  order: Order;
  eventDate: Date;

  constructor(order: Order) {
    this.order = order;
    this.eventDate = new Date();
  }
}
