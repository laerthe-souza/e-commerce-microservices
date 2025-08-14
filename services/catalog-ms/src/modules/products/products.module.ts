import { CategoriesModule } from '@modules/categories/categories.module';
import { Module } from '@nestjs/common';

import { CreateProductUseCase } from './application/usecases/create-product.usecase';
import { FindAllProductsUseCase } from './application/usecases/find-all-products.usecase';
import { FindProductUseCase } from './application/usecases/find-product.usecase';
import { LinkProductUseCase } from './application/usecases/link-product.usecase';
import { UpdateProductUseCase } from './application/usecases/update-product.usecase';
import { ProductsRepository } from './infrastructure/repositories/implementations/products.repository';
import { ProductsController } from './presentation/products.controller';

@Module({
  imports: [CategoriesModule],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    FindAllProductsUseCase,
    FindProductUseCase,
    UpdateProductUseCase,
    ProductsRepository,
    LinkProductUseCase,
  ],
  exports: [ProductsRepository],
})
export class ProductsModule {}
