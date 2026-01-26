import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, Prisma } from '@prisma/client';
import type { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    // Valider et calculer le prix total
    let totalPrice = 0;
    const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    for (const item of createOrderDto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: { sku: true },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (!product.isActive) {
        throw new BadRequestException(`Product ${product.name} is not available`);
      }

      // Vérifier et réserver le stock
      await this.inventoryService.reserveStock(item.productId, item.quantity);

      const itemPrice = Number(product.price) * item.quantity;
      totalPrice += itemPrice;

      orderItems.push({
        product: { connect: { id: item.productId } },
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    // Créer la commande avec les items en transaction
    return this.prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: OrderStatus.PENDING,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string) {
    return this.prisma.order.findMany({
      where: userId ? { userId } : undefined,
      include: {
        items: {
          include: { product: true },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        ...(userId && { userId }),
      },
      include: {
        items: {
          include: { product: true },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }

    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);

    // Si annulation, libérer le stock réservé
    if (updateOrderStatusDto.status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
      const items = await this.prisma.orderItem.findMany({
        where: { orderId: id },
      });

      for (const item of items) {
        await this.inventoryService.releaseStock(item.productId, item.quantity);
      }
    }

    // Si paiement, déduire le stock physique
    if (updateOrderStatusDto.status === OrderStatus.PAID && order.status === OrderStatus.PENDING) {
      const items = await this.prisma.orderItem.findMany({
        where: { orderId: id },
      });

      for (const item of items) {
        const sku = await this.prisma.sKU.findUnique({
          where: { productId: item.productId },
        });

        if (sku) {
          await this.prisma.sKU.update({
            where: { productId: item.productId },
            data: {
              stock: sku.stock - item.quantity,
              reserved: sku.reserved - item.quantity,
            },
          });
        }
      }
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: updateOrderStatusDto.status },
      include: {
        items: {
          include: { product: true },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getMyOrders(userId: string) {
    return this.findAll(userId);
  }
}
