import { Inject } from '@nestjs/common';
import { ICreatePaymentRequestDTO } from 'src/modules/payments/presentation/dtos/create-payment-request.dto';

import { IPaymentsGateway } from '../../infrastructure/payments-gateway/contracts/payments-gateway.contract';
import { PaymentsGatewayService } from '../../infrastructure/payments-gateway/implementations/payments-gateway.service';

export class CreatePaymentUseCase {
  constructor(
    @Inject(PaymentsGatewayService)
    private readonly paymentsGatewayService: IPaymentsGateway,
  ) {}

  async execute({
    customerId,
    amount,
    paymentMethodId,
    metadata,
  }: ICreatePaymentRequestDTO) {
    const customer = await this.paymentsGatewayService.findCustomer(customerId);

    if (!customer) {
      throw new Error('Customer does not exists');
    }

    return this.paymentsGatewayService.create({
      amount,
      currency: 'brl',
      customerId,
      paymentMethodId,
      metadata,
    });
  }
}
