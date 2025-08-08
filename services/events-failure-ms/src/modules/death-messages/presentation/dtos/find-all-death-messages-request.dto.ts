import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { IDeathMessageStatus } from '@shared/enums/death-message-status.enum';

const statuses = Object.values(IDeathMessageStatus) as unknown as readonly [
  IDeathMessageStatus,
  ...IDeathMessageStatus[],
];

const schema = z.object({
  page: z.number().optional(),
  take: z.number().optional(),
  serviceName: z.string().optional(),
  traceId: z.string().optional(),
  status: z.enum(statuses).optional(),
});

export class IFindAllDeathMessagesRequestDTO extends createZodDto(schema) {}
