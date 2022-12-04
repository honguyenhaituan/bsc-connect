import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Redirect,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppConfig } from 'src/config';
import { BscService } from './bsc.service';
import { CreateOrderData, UpdateOrderData } from './dtos/order.dto';

@Controller()
@ApiTags('BSC')
export class BscController {
  private readonly logger = new Logger(BscController.name);
  constructor(
    private readonly bscService: BscService,
    private readonly config: AppConfig,
  ) {}

  @Get('/')
  @Redirect('https://docs.nestjs.com', 302)
  async login() {
    return {
      url: `https://apiuat.bsc.com.vn/sso/oauth/authorize?client_id=${this.config.clientId}&response_type=code&redirect_uri=http://localhost:5678/auth&scope=general&ui_locales=vi`,
    };
  }

  @Get('/auth')
  async auth(@Query('code') code: string) {
    try {
      await this.bscService.auth(code);
      const data = await this.bscService.getAccountInfo();
      return data;
    } catch (e) {
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }

  @Get('orders')
  async getOrders() {
    try {
      const data = await this.bscService.getOrders();
      return data;
    } catch (e) {
      console.log(JSON.stringify(e));
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }

  @Get('ordersHistory')
  async getOrdersHistory() {
    try {
      const data = await this.bscService.getOrdersHistory();
      return data;
    } catch (e) {
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }

  @Post('orders')
  async createOrder(@Body() order: CreateOrderData) {
    try {
      const data = await this.bscService.createOrder(order);
      return data;
    } catch (e) {
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }

  @Get('orders/:orderId')
  async getOrder(@Param(':orderId') orderId: string) {
    try {
      const data = await this.bscService.getOrder(orderId);
      return data;
    } catch (e) {
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }

  @Put('orders/:orderId')
  async updateOrder(
    @Param(':orderId') orderId: string,
    @Body() order: UpdateOrderData,
  ) {
    try {
      const data = await this.bscService.updateOrder(orderId, order);
      return data;
    } catch (e) {
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }

  @Delete('orders/:orderId')
  async deleteOrder(@Param('orderId') orderId: string) {
    try {
      const data = await this.bscService.deleteOrder(orderId);
      return data;
    } catch (e) {
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }

  @Get('positions')
  async getPositions() {
    try {
      const data = await this.bscService.getPositions();
      return data;
    } catch (e) {
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }

  @Get('positions/:positionId')
  async getPosition(@Param('positionId') positionId: string) {
    try {
      const data = await this.bscService.getPosition(positionId);
      return data;
    } catch (e) {
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }

  @Delete('positions/:positionId')
  async deletePosition(@Param('positionId') positionId: string) {
    try {
      const data = await this.bscService.deletePosition(positionId);
      return data;
    } catch (e) {
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }

  @Get('executions')
  async getExecutions() {
    try {
      const data = await this.bscService.getExecutions();
      return data;
    } catch (e) {
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }

  @Get('quotes')
  async getQuotes(@Query('symbols') symbols: string) {
    try {
      const data = await this.bscService.getQuotes(symbols);
      return data;
    } catch (e) {
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }

  @Get('depth')
  async getDepth(@Query('symbols') symbols: string) {
    try {
      const data = await this.bscService.getDepth(symbols);
      return data;
    } catch (e) {
      this.logger.error(e.response?.data);
      throw new HttpException(e.response?.data, e.status);
    }
  }
}
