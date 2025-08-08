import { DeathMessage } from '@modules/death-messages/domain/entities/death-message.entity';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { IDeathMessagesRepository } from '../contracts/death-messages.repository';
import { IFindDeathMessagesInputDTO } from '../contracts/dtos/find-death-messages-input.dto';
import { IFindDeathMessagesOutputDTO } from '../contracts/dtos/find-death-messages-output.dto';

@Injectable()
export class DeathMessagesRepository implements IDeathMessagesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async insert(deathMessage: DeathMessage): Promise<DeathMessage> {
    const createdDeathMessage = await this.prismaService.deathMessage.create({
      data: deathMessage.toObject(),
    });

    return DeathMessage.restore(createdDeathMessage);
  }

  async save(deathMessage: DeathMessage): Promise<DeathMessage> {
    const updatedDeathMessage = await this.prismaService.deathMessage.update({
      where: {
        id: deathMessage.id,
        createdAt: deathMessage.updatedAt,
      },
      data: deathMessage.toObject(),
    });

    return DeathMessage.restore(updatedDeathMessage);
  }

  async find(
    query?: IFindDeathMessagesInputDTO,
  ): Promise<IFindDeathMessagesOutputDTO> {
    const { page, serviceName, status, take, traceId } = query ?? {};

    const where: Prisma.DeathMessageWhereInput = {
      serviceName,
      status,
      traceId,
    };

    const [deathMessages, count] = await Promise.all([
      this.prismaService.deathMessage.findMany({
        where,
        take,
        skip: page && take ? (page - 1) * take : undefined,
      }),
      this.prismaService.deathMessage.count({
        where,
      }),
    ]);

    return {
      deathMessages: deathMessages.map(deathMessage =>
        DeathMessage.restore(deathMessage),
      ),
      count,
    };
  }

  async findById(id: string): Promise<DeathMessage | null> {
    const deathMessage = await this.prismaService.deathMessage.findUnique({
      where: { id },
    });

    if (!deathMessage) {
      return null;
    }

    return DeathMessage.restore(deathMessage);
  }
}
