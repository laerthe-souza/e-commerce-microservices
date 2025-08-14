import { Product } from '@modules/products/domain/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { IFindProductsInputDTO } from '../contracts/dtos/find-products-input.dto';
import { IFindProductsOutputDTO } from '../contracts/dtos/find-products-output.dto';
import { IProductsRepository } from '../contracts/products-repository.contract';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async insert(product: Product): Promise<Product> {
    const createdProduct = await this.prismaService.tableProduct.create({
      data: product.toObject(),
      include: { category: true },
    });

    return Product.restore(createdProduct);
  }

  async save(product: Product): Promise<Product> {
    const updatedProduct = await this.prismaService.tableProduct.update({
      where: {
        id: product.id,
        updatedAt: product.updatedAt,
      },
      data: product.toObject(),
      include: { category: true },
    });

    return Product.restore(updatedProduct);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prismaService.tableProduct.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return null;
    }

    return Product.restore(product);
  }

  async find(query?: IFindProductsInputDTO): Promise<IFindProductsOutputDTO> {
    const { name, page, search, slug, take } = query ?? {};

    const where: Prisma.TableProductWhereInput = {
      name,
      slug,
      OR: search
        ? [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              slug: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              category: {
                name: { contains: search, mode: 'insensitive' },
              },
            },
          ]
        : undefined,
    };

    const [products, count] = await Promise.all([
      this.prismaService.tableProduct.findMany({
        where,
        skip: page && take ? (page - 1) * take : undefined,
        take,
        include: { category: true },
      }),
      this.prismaService.tableProduct.count({
        where,
      }),
    ]);

    return {
      products: products.map(product => Product.restore(product)),
      count,
    };
  }
}
