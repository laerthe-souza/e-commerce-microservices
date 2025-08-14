import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { CreateCategoryUseCase } from '../application/usecases/create-category.usecase';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly createCategory: CreateCategoryUseCase) {}

  @Post()
  @HttpCode(201)
  async create(@Body('name') name: string) {
    return this.createCategory.execute(name);
  }
}
