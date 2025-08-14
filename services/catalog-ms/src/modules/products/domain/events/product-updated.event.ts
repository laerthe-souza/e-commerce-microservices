import { Product } from '../entities/product.entity';

export class ProductUpdatedEvent {
  product: Product;
  eventDate: Date;

  constructor(product: Product) {
    this.product = product;
    this.eventDate = new Date();
  }
}
