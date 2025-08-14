import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const schema = z.object({
  id: z.string({ required_error: 'Id is required' }),
  name: z.string({ required_error: 'Name is required' }),
  description: z.string({ required_error: 'Description is required' }),
  price: z.number({ required_error: 'Price is required' }),
});

export class ICreateProductRequestDTO extends createZodDto(schema) {}
