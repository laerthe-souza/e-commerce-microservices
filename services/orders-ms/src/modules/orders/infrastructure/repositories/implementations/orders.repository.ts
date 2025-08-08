import { Item } from '@modules/orders/domain/entities/item.entity';
import { Order } from '@modules/orders/domain/entities/order.entity';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { IFindOrdersInputDTO } from '../contracts/dtos/find-orders-input.dto';
import { IFindOrdersOutputDTO } from '../contracts/dtos/find-orders-output.dto';
import { IOrdersRepository } from '../contracts/orders-repository.contract';

@Injectable()
export class OrdersRepository implements IOrdersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async insert(order: Order): Promise<Order> {
    const createdOrder = await this.prismaService.tableOrder.create({
      data: {
        ...order.toObject(),
        items: {
          createMany: {
            data: order.items.map(item => item.toObject()),
            skipDuplicates: true,
          },
        },
      },
      include: { items: true },
    });

    return Order.restore({
      ...createdOrder,
      items: createdOrder.items.map(item => Item.restore(item)),
    });
  }

  async save(order: Order): Promise<Order> {
    const updatedOrder = await this.prismaService.tableOrder.update({
      where: {
        id: order.id,
        updatedAt: order.updatedAt,
      },
      data: {
        status: order.status,
        transactionId: order.transactionId,
      },
    });

    return Order.restore(updatedOrder);
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prismaService.tableOrder.findUnique({
      where: { id },
    });

    if (!order) {
      return null;
    }

    return Order.restore(order);
  }

  async find(query?: IFindOrdersInputDTO): Promise<IFindOrdersOutputDTO> {
    const { customerId, page, status, take, transactionId } = query ?? {};

    const where: Prisma.TableOrderWhereInput = {
      customerId,
      transactionId,
      status,
    };

    const [orders, count] = await Promise.all([
      this.prismaService.tableOrder.findMany({
        where,
        skip: page && take ? (page - 1) * take : undefined,
        take,
      }),
      this.prismaService.tableOrder.count({
        where,
      }),
    ]);

    return { orders: orders.map(order => Order.restore(order)), count };
  }
}
