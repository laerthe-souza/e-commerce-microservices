import { Category } from '@modules/categories/domain/entities/category.entity';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { ICategoriesRepository } from '../contracts/categories-repository.contract';

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async insert(input: Category): Promise<Category> {
    const category = await this.prismaService.tableCategory.create({
      data: input.toObject(),
    });

    return Category.restore(category);
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.prismaService.tableCategory.findUnique({
      where: { name },
    });

    if (!category) {
      return null;
    }

    return Category.restore(category);
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prismaService.tableCategory.findUnique({
      where: { id },
    });

    if (!category) {
      return null;
    }

    return Category.restore(category);
  }
}
