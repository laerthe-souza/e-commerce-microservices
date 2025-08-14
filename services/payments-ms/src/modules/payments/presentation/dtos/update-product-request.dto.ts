import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const schema = z.object({
  externalId: z.string({ required_error: 'External id is required' }),
  name: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string().or(z.number())).optional(),
});

export class IUpdateProductRequestDTO extends createZodDto(schema) {}
