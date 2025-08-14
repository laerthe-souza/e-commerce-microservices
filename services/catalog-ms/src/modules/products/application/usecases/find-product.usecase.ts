import { Product } from '@modules/products/domain/entities/product.entity';
import { IProductsRepository } from '@modules/products/infrastructure/repositories/contracts/products-repository.contract';
import { ProductsRepository } from '@modules/products/infrastructure/repositories/implementations/products.repository';
import { Inject } from '@nestjs/common';

export class FindProductUseCase {
  constructor(
    @Inject(ProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(id: string): Promise<ReturnType<Product['toObject']>> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new Error('Product does not exists');
    }

    return product.toObject();
  }
}
