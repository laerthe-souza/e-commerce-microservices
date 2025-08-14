import Stripe from 'stripe';

import { ICreatePaymentInputDTO } from './dtos/create-payment-input.dto';
import { ICreateProductInputDTO } from './dtos/create-product-input.dto';
import { ICreateSubscriptionInputDTO } from './dtos/create-subscription-input.dto';
import { IUpdateProductInputDTO } from './dtos/update-product-input.dto';

export interface IPaymentsGateway {
  create(input: ICreatePaymentInputDTO): Promise<void>;
  createProduct(input: ICreateProductInputDTO): Promise<void>;
  updateProduct(input: IUpdateProductInputDTO): Promise<void>;
  createSubscription(input: ICreateSubscriptionInputDTO): Promise<void>;
  findProduct(id: string): Promise<Stripe.Product>;
  findPrice(id: string): Promise<Stripe.Price | null>;
  findCustomer(id: string): Promise<Stripe.Customer | null>;
}
