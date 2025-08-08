import { Module } from '@nestjs/common';

import { CreateOrderUseCase } from './application/usecases/create-order.usecase';
import { FindAllOrdersUseCase } from './application/usecases/find-all-orders.usecase';
import { FindOrderUseCase } from './application/usecases/find-order.usecase';
import { UpdateOrderStatusUseCase } from './application/usecases/update-order-status.usecase';
import { OrdersController } from './presentation/orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [
    CreateOrderUseCase,
    UpdateOrderStatusUseCase,
    FindAllOrdersUseCase,
    FindOrderUseCase,
  ],
})
export class OrdersModule {}
