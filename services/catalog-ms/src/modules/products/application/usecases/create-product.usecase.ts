import { ICategoriesRepository } from '@modules/categories/infrastructure/repositories/contracts/categories-repository.contract';
import { CategoriesRepository } from '@modules/categories/infrastructure/repositories/implementations/categories.repository';
import { Product } from '@modules/products/domain/entities/product.entity';
import { IProductsRepository } from '@modules/products/infrastructure/repositories/contracts/products-repository.contract';
import { ProductsRepository } from '@modules/products/infrastructure/repositories/implementations/products.repository';
import { ICreateProductRequestDTO } from '@modules/products/presentation/dtos/create-product-request.dto';
import { Inject } from '@nestjs/common';

import { EventsPublisherService } from '@infrastructure/events-publisher/services/events-publisher.service';
import { EVENTS } from '@shared/constants/events.constant';

export class CreateProductUseCase {
  constructor(
    @Inject(ProductsRepository)
    private readonly productsRepository: IProductsRepository,
    @Inject(CategoriesRepository)
    private readonly categoriesRepository: ICategoriesRepository,
    @Inject(EventsPublisherService)
    private readonly eventsPublisher: EventsPublisherService,
  ) {}

  async execute(data: ICreateProductRequestDTO): Promise<void> {
    const category = await this.categoriesRepository.findById(data.categoryId);

    if (!category) {
      throw new Error('Category does not exists');
    }

    const { count } = await this.productsRepository.find({
      name: data.name,
    });

    if (count > 0) {
      throw new Error('Product name already exists');
    }

    const product = Product.create({
      ...data,
      category,
    });

    const createdProduct = await this.productsRepository.insert(product);

    await this.eventsPublisher.emit(
      EVENTS.PRODUCT_CREATED.name,
      createdProduct.toObject(),
    );
  }
}
