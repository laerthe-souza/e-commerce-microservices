import { Module } from '@nestjs/common';

import { CreatePaymentUseCase } from './application/usecases/create-payment.usecase';
import { CreateSubscriptionUseCase } from './application/usecases/create-subscription.usecase';
import { ReceiveEventsUseCase } from './application/usecases/receive-events.usecase';
import { PaymentsGatewayService } from './infrastructure/payments-gateway/implementations/payments-gateway.service';
import { PaymentsController } from './presentation/payments.controller';

@Module({
  controllers: [PaymentsController],
  providers: [
    CreatePaymentUseCase,
    CreateSubscriptionUseCase,
    ReceiveEventsUseCase,
    PaymentsGatewayService,
  ],
})
export class PaymentsModule {}
