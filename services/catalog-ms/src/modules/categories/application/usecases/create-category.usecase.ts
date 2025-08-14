import { Category } from '@modules/categories/domain/entities/category.entity';
import { ICategoriesRepository } from '@modules/categories/infrastructure/repositories/contracts/categories-repository.contract';
import { CategoriesRepository } from '@modules/categories/infrastructure/repositories/implementations/categories.repository';
import { Inject } from '@nestjs/common';

export class CreateCategoryUseCase {
  constructor(
    @Inject(CategoriesRepository)
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(name: string): Promise<ReturnType<Category['toObject']>> {
    const categoryAlreadyExists =
      await this.categoriesRepository.findByName(name);

    if (categoryAlreadyExists) {
      throw new Error('Category name already exists');
    }

    const category = Category.create({ name });

    await this.categoriesRepository.insert(category);

    return category.toObject();
  }
}
