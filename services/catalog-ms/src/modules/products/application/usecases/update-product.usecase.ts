import { IProductsRepository } from '@modules/products/infrastructure/repositories/contracts/products-repository.contract';
import { ProductsRepository } from '@modules/products/infrastructure/repositories/implementations/products.repository';
import { IUpdateProductRequestDTO } from '@modules/products/presentation/dtos/update-product-request.dto';
import { Inject } from '@nestjs/common';

import { EventsPublisherService } from '@infrastructure/events-publisher/services/events-publisher.service';
import { EVENTS } from '@shared/constants/events.constant';

type IRequest = IUpdateProductRequestDTO & {
  id: string;
};

export class UpdateProductUseCase {
  constructor(
    @Inject(ProductsRepository)
    private readonly productsRepository: IProductsRepository,
    @Inject(EventsPublisherService)
    private readonly eventsPublisher: EventsPublisherService,
  ) {}

  async execute(data: IRequest): Promise<void> {
    const product = await this.productsRepository.findById(data.id);

    if (!product) {
      throw new Error('Product does not exists');
    }

    if (data.name) product.updateName(data.name);
    if (data.description) product.updateDescription(data.description);
    if (data.price) product.updatePrice(data.price);

    const updatedProduct = await this.productsRepository.save(product);

    await this.eventsPublisher.emit(
      EVENTS.PRODUCT_UPDATED.name,
      updatedProduct.toObject(),
    );
  }
}
