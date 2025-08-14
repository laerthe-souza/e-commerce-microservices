import { Product } from '@modules/products/domain/entities/product.entity';
import { IProductsRepository } from '@modules/products/infrastructure/repositories/contracts/products-repository.contract';
import { ProductsRepository } from '@modules/products/infrastructure/repositories/implementations/products.repository';
import { IFindAllProductsRequestDTO } from '@modules/products/presentation/dtos/find-all-products-request.dto';
import { Inject } from '@nestjs/common';

type IResponse = {
  products: ReturnType<Product['toObject']>[];
  count: number;
};

export class FindAllProductsUseCase {
  constructor(
    @Inject(ProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(query: IFindAllProductsRequestDTO): Promise<IResponse> {
    const { products, count } = await this.productsRepository.find(query);

    return {
      products: products.map(product => product.toObject()),
      count,
    };
  }
}
