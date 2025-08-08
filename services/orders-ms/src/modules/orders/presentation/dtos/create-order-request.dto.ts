import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const schema = z.object({
  customerId: z.string({ required_error: 'Customer id required' }),
  paymentMethodId: z.string({ required_error: 'Payment method id required' }),
  items: z
    .array(
      z.object({
        productName: z.string({ required_error: 'Product name required' }),
        productId: z
          .string({ required_error: 'Product id required' })
          .uuid('Invalid product id type, expect an uuid type'),
        externalProductId: z.string({
          required_error: 'External product id required',
        }),
        price: z
          .number({ required_error: 'Price required' })
          .nonnegative('Price must be a positive value'),
        quantity: z.number({ required_error: 'Quantity required' }),
      }),
    )
    .nonempty('Least one item is required'),
});

export class ICreateOrderRequestDTO extends createZodDto(schema) {}
