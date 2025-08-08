import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreatePaymentUseCase } from 'src/modules/payments/application/usecases/create-payment.usecase';
import { ReceiveEventsUseCase } from 'src/modules/payments/application/usecases/receive-events.usecase';
import Stripe from 'stripe';

import { LoggingService } from '@infrastructure/config/logging/logging.service';
import { EVENTS } from '@shared/constants/events.constant';
import { eventHandlerTryCatch } from '@shared/helpers/events-handler-try-catch.helper';

import { CreateSubscriptionUseCase } from '../application/usecases/create-subscription.usecase';
import { ICreatePaymentRequestDTO } from './dtos/create-payment-request.dto';
import { ICreateSubscriptionRequestDTO } from './dtos/create-subscription-request.dto';

@Controller('payments')
export class PaymentsController {
  private logger = new LoggingService(PaymentsController.name);

  constructor(
    private readonly receiveEvents: ReceiveEventsUseCase,
    private readonly createPayment: CreatePaymentUseCase,
    private readonly createSubscription: CreateSubscriptionUseCase,
  ) {}

  @Post('webhook')
  @HttpCode(200)
  listenEvents(@Body() data: Stripe.Event) {
    return this.receiveEvents.execute(data);
  }

  @EventPattern(EVENTS.ORDER_CREATED.name)
  async create(@Payload() data: any, @Ctx() ctx: RmqContext) {
    return eventHandlerTryCatch(async order => {
      this.logger.info('New order, creating payment...', order);

      const parsedOrder = ICreatePaymentRequestDTO.create({
        customerId: order.customerId,
        paymentMethodId: order.paymentMethodId,
        amount: order.total,
        metadata: {
          id: order.id,
        },
      });

      return this.createPayment.execute(parsedOrder);
    })(data, ctx);
  }

  @EventPattern(EVENTS.SUBSCRIPTION_CREATED.name)
  async subscribe(@Payload() data: any, @Ctx() ctx: RmqContext) {
    return eventHandlerTryCatch(async subscription => {
      this.logger.info(
        'New subscription, creating subscription payment...',
        subscription,
      );

      const parsedSubscription = ICreateSubscriptionRequestDTO.create({
        customerId: subscription.customerId,
        paymentMethodId: subscription.paymentMethodId,
        amount: subscription.total,
        metadata: {
          id: subscription.id,
        },
      });

      return this.createSubscription.execute(parsedSubscription);
    })(data, ctx);
  }
}
