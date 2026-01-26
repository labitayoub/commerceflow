import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReserveStockDto {
  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
