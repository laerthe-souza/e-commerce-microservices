import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrderStatus } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';

import { LoggingService } from '@infrastructure/config/logging/logging.service';
import { EVENTS } from '@shared/constants/events.constant';
import { eventHandlerTryCatch } from '@shared/helpers/events-handler-try-catch.helper';

import { CreateOrderUseCase } from '../application/usecases/create-order.usecase';
import { FindAllOrdersUseCase } from '../application/usecases/find-all-orders.usecase';
import { FindOrderUseCase } from '../application/usecases/find-order.usecase';
import { UpdateOrderStatusUseCase } from '../application/usecases/update-order-status.usecase';
import { ICreateOrderRequestDTO } from './dtos/create-order-request.dto';
import { IFindAllOrdersRequestDTO } from './dtos/find-all-orders-request.dto';

@Controller('orders')
export class OrdersController {
  private logger = new LoggingService(OrdersController.name);

  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly updateOrderStatus: UpdateOrderStatusUseCase,
    private readonly findAllOrders: FindAllOrdersUseCase,
    private readonly findOrder: FindOrderUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body(new ZodValidationPipe(ICreateOrderRequestDTO))
    data: ICreateOrderRequestDTO,
  ) {
    return this.createOrder.execute(data);
  }

  @Get()
  @HttpCode(200)
  async findAll(
    @Query(new ZodValidationPipe(IFindAllOrdersRequestDTO))
    query: IFindAllOrdersRequestDTO,
  ) {
    return this.findAllOrders.execute(query);
  }

  @Get('id')
  @HttpCode(200)
  async find(@Param('id') id: string) {
    return this.findOrder.execute(id);
  }

  @EventPattern(EVENTS.PAYMENT_SUCCESS.name)
  async paymentSuccess(@Payload() data: any, @Ctx() ctx: RmqContext) {
    return eventHandlerTryCatch(async payload => {
      this.logger.info(`Payment approved, updating order status...`, data);

      return this.updateOrderStatus.execute({
        id: payload.id,
        status: OrderStatus.approved,
        transactionId: payload.transactionId,
      });
    })(data, ctx);
  }

  @EventPattern(EVENTS.PAYMENT_FAILED.name)
  async paymentFailed(@Payload() data: any, @Ctx() ctx: RmqContext) {
    return eventHandlerTryCatch(async payload => {
      this.logger.info(`Payment failed, updating order status...`, payload);

      return this.updateOrderStatus.execute({
        id: payload.id,
        status: OrderStatus.approved,
        transactionId: payload.transactionId,
      });
    })(data, ctx);
  }

  @EventPattern(EVENTS.PAYMENT_CANCELED.name)
  async paymentCanceled(@Payload() data: any, @Ctx() ctx: RmqContext) {
    return eventHandlerTryCatch(async payload => {
      this.logger.info(`Payment canceled, updating order status...`, payload);

      return this.updateOrderStatus.execute({
        id: payload.id,
        status: OrderStatus.approved,
        transactionId: payload.transactionId,
      });
    })(data, ctx);
  }
}
