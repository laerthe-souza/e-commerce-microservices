import { OrderStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const statuses = Object.values(OrderStatus) as unknown as readonly [
  OrderStatus,
  ...OrderStatus[],
];

const schema = z.object({
  id: z
    .string({ required_error: 'Order id required' })
    .uuid('Invalid order id type, expect an uuid type'),
  transactionId: z.string().optional(),
  status: z.enum(statuses, { required_error: 'Order status required' }),
});

export class IUpdateOrderStatusRequestDTO extends createZodDto(schema) {}
