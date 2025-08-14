import Stripe from 'stripe';

import { ICreatePaymentInputDTO } from '../contracts/dtos/create-payment-input.dto';
import { ICreateProductInputDTO } from '../contracts/dtos/create-product-input.dto';
import { ICreateSubscriptionInputDTO } from '../contracts/dtos/create-subscription-input.dto';
import { IUpdateProductInputDTO } from '../contracts/dtos/update-product-input.dto';
import { IPaymentsGateway } from '../contracts/payments-gateway.contract';

export class PaymentsGatewayService implements IPaymentsGateway {
  private stripe = new Stripe(myEnv.STRIPE_SECRET_KEY, {
    typescript: true,
  });

  async create({
    amount,
    customerId,
    currency,
    paymentMethodId,
    metadata,
  }: ICreatePaymentInputDTO): Promise<void> {
    await this.stripe.paymentIntents.create({
      amount,
      currency,
      confirm: true,
      customer: customerId,
      payment_method: paymentMethodId,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      metadata,
    });
  }

  async createProduct(input: ICreateProductInputDTO): Promise<void> {
    await this.stripe.products.create({
      name: input.name,
      description: input.description,
      metadata: input.metadata,
      default_price_data: {
        currency: input.currency,
        unit_amount: input.price,
      },
    });
  }

  async updateProduct(input: IUpdateProductInputDTO): Promise<void> {
    await this.stripe.products.update(input.id, {
      name: input.name,
      description: input.description,
      metadata: input.metadata,
      default_price: input.price?.toString(),
    });
  }

  async createSubscription({
    customerId,
    currency,
    paymentMethodId,
    priceId,
    metadata,
  }: ICreateSubscriptionInputDTO): Promise<void> {
    await this.stripe.subscriptions.create({
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      proration_behavior: 'create_prorations',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      currency,
      customer: customerId,
      metadata,
    });
  }

  async findProduct(id: string): Promise<Stripe.Product> {
    const product = await this.stripe.products.retrieve(id, {
      expand: ['default_price'],
    });

    return product;
  }

  async findPrice(id: string): Promise<Stripe.Price> {
    const price = await this.stripe.prices.retrieve(id);

    return price;
  }

  async findCustomer(id: string): Promise<Stripe.Customer | null> {
    const customer = await this.stripe.customers.retrieve(id);

    if (customer.deleted) {
      return null;
    }

    return customer;
  }
}
