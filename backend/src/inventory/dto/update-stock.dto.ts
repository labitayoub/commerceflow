import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  stock: number;
}
