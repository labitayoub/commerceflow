import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
    let service: ProductService;

    const mockProduct = {
        id: 'test-uuid-1',
        name: 'Test Product',
        description: 'Test description',
        price: 99.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockPrismaService = {
        product: {
            create: jest.fn().mockResolvedValue(mockProduct),
            findMany: jest.fn().mockResolvedValue([mockProduct]),
            findUnique: jest.fn().mockResolvedValue(mockProduct),
            update: jest.fn().mockResolvedValue(mockProduct),
            delete: jest.fn().mockResolvedValue(mockProduct),
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
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a product', async () => {
            const dto = { name: 'Test', price: 99.99, stock: 100 };
            mockPrismaService.product.create.mockResolvedValue(mockProduct);

            const result = await service.create(dto);
            expect(result).toEqual(mockProduct);
        });
    });

    describe('findAll', () => {
        it('should return all products', async () => {
            const result = await service.findAll();
            expect(result).toEqual([mockProduct]);
        });
    });

    describe('findOne', () => {
        it('should return a product', async () => {
            const result = await service.findOne('test-uuid-1');
            expect(result).toEqual(mockProduct);
        });

        it('should throw NotFoundException', async () => {
            mockPrismaService.product.findUnique.mockResolvedValue(null);
            await expect(service.findOne('not-found')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a product', async () => {
            mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
            const result = await service.update('test-uuid-1', { name: 'Updated' });
            expect(result).toEqual(mockProduct);
        });
    });

    describe('remove', () => {
        it('should delete a product', async () => {
            mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
            const result = await service.remove('test-uuid-1');
            expect(result).toEqual(mockProduct);
        });
    });
});
