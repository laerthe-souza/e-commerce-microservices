import { OrdersRepository } from '@modules/orders/infrastructure/repositories/implementations/orders.repository';
import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaService, OrdersRepository],
  exports: [PrismaService, OrdersRepository],
})
export class DatabaseModule {}
