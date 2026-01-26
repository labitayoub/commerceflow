import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import type { SKU } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async updateStock(productId: string, updateStockDto: UpdateStockDto): Promise<SKU> {
    const sku = await this.prisma.sKU.findUnique({ where: { productId } });

    if (!sku) {
      return this.prisma.sKU.create({
        data: {
          productId,
          stock: updateStockDto.stock,
          reserved: 0,
        },
      });
    }

    return this.prisma.sKU.update({
      where: { productId },
      data: { stock: updateStockDto.stock },
    });
  }

  async reserveStock(productId: string, quantity: number): Promise<SKU> {
    const sku = await this.prisma.sKU.findUnique({ where: { productId } });

    if (!sku) {
      throw new NotFoundException(`SKU for product ${productId} not found`);
    }

    const available = sku.stock - sku.reserved;
    if (available < quantity) {
      throw new BadRequestException(`Insufficient stock. Available: ${available}, Requested: ${quantity}`);
    }

    return this.prisma.sKU.update({
      where: { productId },
      data: { reserved: sku.reserved + quantity },
    });
  }

  async releaseStock(productId: string, quantity: number): Promise<SKU> {
    const sku = await this.prisma.sKU.findUnique({ where: { productId } });

    if (!sku) {
      throw new NotFoundException(`SKU for product ${productId} not found`);
    }

    return this.prisma.sKU.update({
      where: { productId },
      data: { reserved: Math.max(0, sku.reserved - quantity) },
    });
  }

  async getAvailableStock(productId: string): Promise<{ available: number; total: number; reserved: number }> {
    const sku = await this.prisma.sKU.findUnique({ where: { productId } });

    if (!sku) {
      return { available: 0, total: 0, reserved: 0 };
    }

    return {
      available: sku.stock - sku.reserved,
      total: sku.stock,
      reserved: sku.reserved,
    };
  }

  async getLowStockProducts(threshold: number = 10) {
    const products = await this.prisma.product.findMany({
      where: {
        sku: {
          stock: { lte: threshold },
        },
      },
      include: { sku: true, category: true },
    });

    return products;
  }

  async findAll() {
    return this.prisma.sKU.findMany({
      include: { product: { include: { category: true } } },
      orderBy: { stock: 'asc' },
    });
  }

  async findOne(productId: string): Promise<SKU> {
    const sku = await this.prisma.sKU.findUnique({
      where: { productId },
      include: { product: true },
    });

    if (!sku) {
      throw new NotFoundException(`SKU for product ${productId} not found`);
    }

    return sku;
  }
}
