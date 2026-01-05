import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;
  let inventoryService: InventoryService;

  const mockProduct = {
    id: 'prod-1',
    name: 'Test Product',
    price: 100,
    isActive: true,
    sku: { stock: 50, reserved: 0 },
  };

  const mockOrder = {
    id: 'order-1',
    userId: 'user-1',
    status: OrderStatus.PENDING,
    totalPrice: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    product: { findUnique: jest.fn() },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    orderItem: { findMany: jest.fn() },
    sku: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockInventoryService = {
    reserveStock: jest.fn(),
    releaseStock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: InventoryService, useValue: mockInventoryService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
    inventoryService = module.get<InventoryService>(InventoryService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order and reserve stock', async () => {
      const dto = { items: [{ productId: 'prod-1', quantity: 2 }] };
      
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockInventoryService.reserveStock.mockResolvedValue({});
      mockPrismaService.order.create.mockResolvedValue(mockOrder);

      const result = await service.create('user-1', dto);

      expect(result).toEqual(mockOrder);
      expect(inventoryService.reserveStock).toHaveBeenCalledWith('prod-1', 2);
    });

    it('should throw NotFoundException if product not found', async () => {
      const dto = { items: [{ productId: 'prod-1', quantity: 2 }] };
      
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.create('user-1', dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if product is inactive', async () => {
      const dto = { items: [{ productId: 'prod-1', quantity: 2 }] };
      
      mockPrismaService.product.findUnique.mockResolvedValue({ ...mockProduct, isActive: false });

      await expect(service.create('user-1', dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateStatus', () => {
    it('should release stock when order is cancelled', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);
      mockPrismaService.orderItem.findMany.mockResolvedValue([
        { productId: 'prod-1', quantity: 2 },
      ]);
      mockInventoryService.releaseStock.mockResolvedValue({});
      mockPrismaService.order.update.mockResolvedValue({ ...mockOrder, status: OrderStatus.CANCELLED });

      await service.updateStatus('order-1', { status: OrderStatus.CANCELLED });

      expect(inventoryService.releaseStock).toHaveBeenCalledWith('prod-1', 2);
    });
  });
});
