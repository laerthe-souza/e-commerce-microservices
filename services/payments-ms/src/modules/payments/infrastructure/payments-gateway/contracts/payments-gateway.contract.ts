import Stripe from 'stripe';

import { ICreatePaymentInputDTO } from './dtos/create-payment-input.dto';
import { ICreateSubscriptionInputDTO } from './dtos/create-subscription-input.dto';

export interface IPaymentsGateway {
  create(input: ICreatePaymentInputDTO): Promise<void>;
  createSubscription(input: ICreateSubscriptionInputDTO): Promise<void>;
  findProduct(id: string): Promise<Stripe.Product>;
  findPrice(id: string): Promise<Stripe.Price | null>;
  findCustomer(id: string): Promise<Stripe.Customer | null>;
}
