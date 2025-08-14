import { IProductsRepository } from '@modules/products/infrastructure/repositories/contracts/products-repository.contract';
import { ProductsRepository } from '@modules/products/infrastructure/repositories/implementations/products.repository';
import { ILinkProductRequestDTO } from '@modules/products/presentation/dtos/link-product-request.dto';
import { Inject } from '@nestjs/common';

export class LinkProductUseCase {
  constructor(
    @Inject(ProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(data: ILinkProductRequestDTO): Promise<void> {
    const product = await this.productsRepository.findById(data.id);

    if (!product) {
      throw new Error('Product does not exists');
    }

    product.link(data.externalId);

    await this.productsRepository.save(product);
  }
}
