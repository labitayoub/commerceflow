import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import type { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

async create(createProductDto: CreateProductDto): Promise<Product> {
  const { categoryId, stock, ...productData } = createProductDto;
  return this.prisma.product.create({
    data: {
      ...productData,
      categoryId,
      sku: {
        create: {
          stock: stock || 0,
          reserved: 0,
        },
      },
    },
    include: { category: true, sku: true },
  });
}


  async findAll(filters: FilterProductDto) {
    const { page = 1, limit = 10, categoryId, search, minPrice, maxPrice } = filters;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

const [products, total] = await Promise.all([
  this.prisma.product.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { category: true, sku: true },
  }),
  this.prisma.product.count({ where }),
]);


    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, sku: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.findOne(id);

    const { stock, ...productData } = updateProductDto as any;

    // Mise à jour du produit et optionnellement du stock
    const updateData: any = {
      ...productData,
    };

    if (stock !== undefined) {
      updateData.sku = {
        update: {
          stock,
        },
      };
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { 
        category: true,
        sku: true,
      },
    });
  }

  async remove(id: string): Promise<Product> {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}