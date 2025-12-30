import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { Product } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        return this.prisma.product.create({
            data: createProductDto,
        });
    }

    async findAll(): Promise<Product[]> {
        return this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        await this.findOne(id);

        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }

    async remove(id: string): Promise<Product> {
        await this.findOne(id);

        return this.prisma.product.delete({
            where: { id },
        });
    }
}
