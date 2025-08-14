import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const schema = z.object({
  name: z.string({ required_error: 'Customer id required' }),
  description: z.string({ required_error: 'Payment method id required' }),
  price: z
    .number({ required_error: 'Price required' })
    .nonnegative('Price must be a positive value'),
  categoryId: z.string({ required_error: 'Category id required' }),
});

export class ICreateProductRequestDTO extends createZodDto(schema) {}
