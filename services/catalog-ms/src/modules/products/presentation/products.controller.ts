import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ZodValidationPipe } from 'nestjs-zod';

import { LoggingService } from '@infrastructure/config/logging/logging.service';
import { EVENTS } from '@shared/constants/events.constant';
import { eventHandlerTryCatch } from '@shared/helpers/events-handler-try-catch.helper';

import { CreateProductUseCase } from '../application/usecases/create-product.usecase';
import { FindAllProductsUseCase } from '../application/usecases/find-all-products.usecase';
import { FindProductUseCase } from '../application/usecases/find-product.usecase';
import { LinkProductUseCase } from '../application/usecases/link-product.usecase';
import { UpdateProductUseCase } from '../application/usecases/update-product.usecase';
import { ICreateProductRequestDTO } from './dtos/create-product-request.dto';
import { IFindAllProductsRequestDTO } from './dtos/find-all-products-request.dto';
import { ILinkProductRequestDTO } from './dtos/link-product-request.dto';
import { IUpdateProductRequestDTO } from './dtos/update-product-request.dto';

@Controller('products')
export class ProductsController {
  private logger = new LoggingService(ProductsController.name);

  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly findAllProducts: FindAllProductsUseCase,
    private readonly findProduct: FindProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly linkProduct: LinkProductUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body(new ZodValidationPipe(ICreateProductRequestDTO))
    data: ICreateProductRequestDTO,
  ) {
    return this.createProduct.execute(data);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(IUpdateProductRequestDTO))
    data: IUpdateProductRequestDTO,
  ) {
    return this.updateProduct.execute({ ...data, id });
  }

  @Get()
  @HttpCode(200)
  async findAll(
    @Query(new ZodValidationPipe(IFindAllProductsRequestDTO))
    query: IFindAllProductsRequestDTO,
  ) {
    return this.findAllProducts.execute(query);
  }

  @Get('id')
  @HttpCode(200)
  async find(@Param('id') id: string) {
    return this.findProduct.execute(id);
  }

  @EventPattern(EVENTS.PAYMENT_PRODUCT_CREATED.name)
  async onProductCreated(@Payload() data: any, @Ctx() ctx: RmqContext) {
    return eventHandlerTryCatch(async paymentProduct => {
      this.logger.info(
        'New payment product, linking with product in catalog...',
        paymentProduct,
      );

      const product = ILinkProductRequestDTO.create(paymentProduct);

      await this.linkProduct.execute(product);
    })(data, ctx);
  }
}
