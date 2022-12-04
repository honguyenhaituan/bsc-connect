import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderData {
  @ApiProperty({
    description: 'Mã chứng khoáng',
  })
  instrument: string;
  @ApiProperty({
    description: 'Khối lượng',
  })
  qty: number;
  @ApiProperty({
    description: 'Lệnh đặt',
    enum: ['buy', 'sell'],
  })
  side: 'buy' | 'sell';
  @ApiProperty({
    description: 'Loại lệnh',
    enum: ['limit', 'market'],
  })
  type: 'limit' | 'market';
  @ApiProperty({})
  limitPrice: number;
  @ApiProperty({
    description: 'Ngày hết hạn, định dạng UNIX',
  })
  durationDateTime: number;
  @ApiProperty({})
  digitalSignature: string;
}

export class UpdateOrderData {
  @ApiProperty({})
  qty: string;
  @ApiProperty({})
  limitPrice: string;
  @ApiProperty({})
  stopPrice: string;
  @ApiProperty({})
  stopLoss: string;
  @ApiProperty({})
  takeProfit: string;
  @ApiProperty({})
  digitalSignature: string;
}
