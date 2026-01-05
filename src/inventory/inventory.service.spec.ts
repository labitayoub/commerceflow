import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: PrismaService;

  const mockSKU = {
    id: 'sku-1',
    productId: 'prod-1',
    stock: 100,
    reserved: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    sku: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reserveStock', () => {
    it('should reserve stock successfully', async () => {
      mockPrismaService.sku.findUnique.mockResolvedValue(mockSKU);
      mockPrismaService.sku.update.mockResolvedValue({ ...mockSKU, reserved: 15 });

      const result = await service.reserveStock('prod-1', 5);

      expect(result.reserved).toBe(15);
    });

    it('should throw BadRequestException if insufficient stock', async () => {
      mockPrismaService.sku.findUnique.mockResolvedValue(mockSKU);

      await expect(service.reserveStock('prod-1', 100)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if SKU not found', async () => {
      mockPrismaService.sku.findUnique.mockResolvedValue(null);

      await expect(service.reserveStock('prod-1', 5)).rejects.toThrow(NotFoundException);
    });
  });

  describe('releaseStock', () => {
    it('should release reserved stock', async () => {
      mockPrismaService.sku.findUnique.mockResolvedValue(mockSKU);
      mockPrismaService.sku.update.mockResolvedValue({ ...mockSKU, reserved: 5 });

      const result = await service.releaseStock('prod-1', 5);

      expect(result.reserved).toBe(5);
    });
  });

  describe('getAvailableStock', () => {
    it('should return available stock', async () => {
      mockPrismaService.sku.findUnique.mockResolvedValue(mockSKU);

      const result = await service.getAvailableStock('prod-1');

      expect(result).toEqual({ available: 90, total: 100, reserved: 10 });
    });
  });
});
