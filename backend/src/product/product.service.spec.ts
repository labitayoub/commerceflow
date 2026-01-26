import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  const mockProduct = {
    id: 'test-uuid-1',
    name: 'Test Product',
    description: 'Test description',
    price: 99.99,
    isActive: true,
    categoryId: 'cat-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: 'cat-1', name: 'Electronics', createdAt: new Date(), updatedAt: new Date() },
    sku: { id: 'sku-1', productId: 'test-uuid-1', stock: 100, reserved: 0, createdAt: new Date(), updatedAt: new Date() },
  };

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto = { name: 'Test', description: 'Desc', price: 99.99, stock: 100, categoryId: 'cat-1' };
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.create(dto);
      
      expect(result).toEqual(mockProduct);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          name: 'Test',
          description: 'Desc',
          price: 99.99,
          categoryId: 'cat-1',
          sku: {
            create: {
              stock: 100,
              reserved: 0,
            },
          },
        },
        include: { category: true, sku: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual([mockProduct]);
      expect(result.meta).toEqual({ total: 1, page: 1, limit: 10, totalPages: 1 });
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { category: true, sku: true },
        }),
      );
    });

    it('should filter by category', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.findAll({ categoryId: 'cat-1', page: 1, limit: 10 });

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoryId: 'cat-1' }),
        }),
      );
    });

    it('should filter by price range', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.findAll({ minPrice: 50, maxPrice: 150, page: 1, limit: 10 });

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: { gte: 50, lte: 150 },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne('test-uuid-1');

      expect(result).toEqual(mockProduct);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-uuid-1' },
        include: { category: true, sku: true },
      });
    });

    it('should throw NotFoundException when product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('not-found')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({ ...mockProduct, name: 'Updated' });

      const result = await service.update('test-uuid-1', { name: 'Updated' });

      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.remove('test-uuid-1');

      expect(result).toEqual(mockProduct);
    });
  });
});
