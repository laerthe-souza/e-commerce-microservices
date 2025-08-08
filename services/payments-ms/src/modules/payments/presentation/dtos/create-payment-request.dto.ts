import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const schema = z.object({
  customerId: z.string({ required_error: 'Customer id is required' }),
  amount: z.number({ required_error: 'Amount is required' }),
  paymentMethodId: z.string({
    required_error: 'Payment method id is required',
  }),
  metadata: z.record(z.string().or(z.number())).optional(),
});

export class ICreatePaymentRequestDTO extends createZodDto(schema) {}
