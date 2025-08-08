import { Inject } from '@nestjs/common';

import { IPaymentsGateway } from '../../infrastructure/payments-gateway/contracts/payments-gateway.contract';
import { PaymentsGatewayService } from '../../infrastructure/payments-gateway/implementations/payments-gateway.service';
import { ICreateSubscriptionRequestDTO } from '../../presentation/dtos/create-subscription-request.dto';

export class CreateSubscriptionUseCase {
  constructor(
    @Inject(PaymentsGatewayService)
    private readonly paymentsGatewayService: IPaymentsGateway,
  ) {}

  async execute({
    customerId,
    priceId,
    paymentMethodId,
    metadata,
  }: ICreateSubscriptionRequestDTO) {
    const customer = await this.paymentsGatewayService.findCustomer(customerId);

    if (!customer) {
      throw new Error('Customer does not exists');
    }

    const price = await this.paymentsGatewayService.findPrice(priceId);

    if (!price) {
      throw new Error('Price does not exists');
    }

    return this.paymentsGatewayService.createSubscription({
      currency: price.currency,
      priceId,
      customerId,
      paymentMethodId,
      metadata,
    });
  }
}
