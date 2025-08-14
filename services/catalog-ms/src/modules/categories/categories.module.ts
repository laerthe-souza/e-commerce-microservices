import { Module } from '@nestjs/common';

import { CreateCategoryUseCase } from './application/usecases/create-category.usecase';
import { CategoriesRepository } from './infrastructure/repositories/implementations/categories.repository';
import { CategoriesController } from './presentation/categories.controller';

@Module({
  controllers: [CategoriesController],
  providers: [CreateCategoryUseCase, CategoriesRepository],
  exports: [CategoriesRepository],
})
export class CategoriesModule {}
