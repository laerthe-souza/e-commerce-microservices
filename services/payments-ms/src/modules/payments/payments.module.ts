import { Module } from '@nestjs/common';

import { CreatePaymentUseCase } from './application/usecases/create-payment.usecase';
import { CreateProductUseCase } from './application/usecases/create-product.usecase';
import { CreateSubscriptionUseCase } from './application/usecases/create-subscription.usecase';
import { ReceiveEventsUseCase } from './application/usecases/receive-events.usecase';
import { UpdateProductUseCase } from './application/usecases/update-product.usecase';
import { PaymentsGatewayService } from './infrastructure/payments-gateway/implementations/payments-gateway.service';
import { PaymentsController } from './presentation/payments.controller';

@Module({
  controllers: [PaymentsController],
  providers: [
    CreatePaymentUseCase,
    CreateSubscriptionUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    ReceiveEventsUseCase,
    PaymentsGatewayService,
  ],
})
export class PaymentsModule {}
