import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const schema = z.object({
  id: z.string({ required_error: 'Id is required' }),
  externalId: z.string({ required_error: 'External id is required' }),
});

export class ILinkProductRequestDTO extends createZodDto(schema) {}
