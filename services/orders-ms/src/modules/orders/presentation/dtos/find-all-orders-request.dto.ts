import { OrderStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const statuses = Object.values(OrderStatus) as unknown as readonly [
  OrderStatus,
  ...OrderStatus[],
];

const schema = z.object({
  page: z.number().optional(),
  take: z.number().optional(),
  transactionId: z.string().optional(),
  customerId: z.string().optional(),
  status: z.enum(statuses).optional(),
});

export class IFindAllOrdersRequestDTO extends createZodDto(schema) {}
