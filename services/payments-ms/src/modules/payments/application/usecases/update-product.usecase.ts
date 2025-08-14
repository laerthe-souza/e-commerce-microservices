import { Inject } from '@nestjs/common';

import { IPaymentsGateway } from '../../infrastructure/payments-gateway/contracts/payments-gateway.contract';
import { PaymentsGatewayService } from '../../infrastructure/payments-gateway/implementations/payments-gateway.service';
import { IUpdateProductRequestDTO } from '../../presentation/dtos/update-product-request.dto';

export class UpdateProductUseCase {
  constructor(
    @Inject(PaymentsGatewayService)
    private readonly paymentsGatewayService: IPaymentsGateway,
  ) {}

  async execute({
    externalId,
    name,
    description,
    metadata,
  }: IUpdateProductRequestDTO) {
    const product = await this.paymentsGatewayService.findProduct(externalId);

    if (product) {
      await this.paymentsGatewayService.updateProduct({
        id: externalId,
        name,
        description,
        metadata,
      });
    }
  }
}
