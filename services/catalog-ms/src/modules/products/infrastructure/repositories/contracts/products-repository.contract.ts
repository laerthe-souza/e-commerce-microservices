import { Product } from '@modules/products/domain/entities/product.entity';

import { IFindProductsInputDTO } from './dtos/find-products-input.dto';
import { IFindProductsOutputDTO } from './dtos/find-products-output.dto';

export interface IProductsRepository {
  insert(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<Product>;
  find(query?: IFindProductsInputDTO): Promise<IFindProductsOutputDTO>;
}
