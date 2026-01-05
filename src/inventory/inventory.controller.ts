import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all SKUs (Admin only)' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('low-stock')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get low stock products (Admin only)' })
  @ApiQuery({ name: 'threshold', required: false, example: 10 })
  getLowStock(@Query('threshold') threshold?: number) {
    return this.inventoryService.getLowStockProducts(threshold ? +threshold : 10);
  }

  @Get(':productId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get SKU by product ID (Admin only)' })
  findOne(@Param('productId') productId: string) {
    return this.inventoryService.findOne(productId);
  }

  @Get(':productId/available')
  @ApiOperation({ summary: 'Get available stock for a product' })
  getAvailable(@Param('productId') productId: string) {
    return this.inventoryService.getAvailableStock(productId);
  }

  @Patch(':productId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update stock for a product (Admin only)' })
  updateStock(@Param('productId') productId: string, @Body() updateStockDto: UpdateStockDto) {
    return this.inventoryService.updateStock(productId, updateStockDto);
  }
}
