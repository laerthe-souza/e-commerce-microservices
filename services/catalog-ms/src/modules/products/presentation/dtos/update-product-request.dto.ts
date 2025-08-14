import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const schema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().nonnegative('Price must be a positive value').optional(),
});

export class IUpdateProductRequestDTO extends createZodDto(schema) {}
