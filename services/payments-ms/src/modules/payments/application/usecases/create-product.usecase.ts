import { Inject } from '@nestjs/common';

import { IPaymentsGateway } from '../../infrastructure/payments-gateway/contracts/payments-gateway.contract';
import { PaymentsGatewayService } from '../../infrastructure/payments-gateway/implementations/payments-gateway.service';
import { ICreateProductRequestDTO } from '../../presentation/dtos/create-product-request.dto';

export class CreateProductUseCase {
  constructor(
    @Inject(PaymentsGatewayService)
    private readonly paymentsGatewayService: IPaymentsGateway,
  ) {}

  async execute({ id, name, description, price }: ICreateProductRequestDTO) {
    await this.paymentsGatewayService.createProduct({
      name,
      description,
      currency: 'brl',
      price,
      metadata: { id },
    });
  }
}
