import { Product } from '@modules/products/domain/entities/product.entity';

export type IFindProductsOutputDTO = {
  products: Product[];
  count: number;
};
