import { Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';

import { FindAllDeathMessagesUseCase } from '../application/usecases/find-all-death-messages.usecase';
import { ResendDeathMessagesUseCase } from '../application/usecases/resend-death-message.usecase';
import { SaveDeathMessageUseCase } from '../application/usecases/save-death-message.usecase';
import { IFindAllDeathMessagesRequestDTO } from './dtos/find-all-death-messages-request.dto';

@Controller('death-messages')
export class DeathMessagesController {
  constructor(
    private readonly resendDeathMessage: ResendDeathMessagesUseCase,
    private readonly saveDeathMessage: SaveDeathMessageUseCase,
    private readonly findAllDeathMessages: FindAllDeathMessagesUseCase,
  ) {}

  @Post(':id/resend')
  @HttpCode(200)
  async resend(@Param('id') id: string) {
    return this.resendDeathMessage.execute(id);
  }

  @Get()
  @HttpCode(200)
  async findAll(
    @Query(new ZodValidationPipe(IFindAllDeathMessagesRequestDTO))
    query: IFindAllDeathMessagesRequestDTO,
  ) {
    return this.findAllDeathMessages.execute(query);
  }
}
