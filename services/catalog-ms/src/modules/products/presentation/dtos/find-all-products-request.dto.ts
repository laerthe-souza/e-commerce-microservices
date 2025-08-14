import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const schema = z.object({
  page: z.number().optional(),
  take: z.number().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  search: z.string().optional(),
});

export class IFindAllProductsRequestDTO extends createZodDto(schema) {}
