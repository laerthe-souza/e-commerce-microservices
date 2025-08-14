import { Category } from '@modules/categories/domain/entities/category.entity';

export interface ICategoriesRepository {
  insert(input: Category): Promise<Category>;
  findByName(name: string): Promise<Category | null>;
  findById(id: string): Promise<Category | null>;
}
