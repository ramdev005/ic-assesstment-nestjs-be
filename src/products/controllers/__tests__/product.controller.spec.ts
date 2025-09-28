import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../../services';
import { Product } from '../../entities';
import { Price, Quantity } from '../../../shared/value-objects';
import { CreateProductDto, UpdateProductDto } from '../../dto';

describe('ProductController', () => {
  let controller: ProductController;
  let mockService: jest.Mocked<ProductService>;

  const mockProduct = Product.create(
    'Test Product',
    'TEST-001',
    new Price(99.99, 'USD'),
    new Quantity(10),
    'Test Description',
    'electronics',
    ['http://example.com/image.jpg'],
    'Test Brand'
  );

  beforeEach(async () => {
    const mockProductService = {
      createProduct: jest.fn(),
      findAllProducts: jest.fn(),
      findProductById: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    mockService = module.get(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createProductDto: CreateProductDto = {
      name: 'Test Product',
      sku: 'TEST-001',
      price: 99.99,
      currency: 'USD',
      stockQuantity: 10,
      description: 'Test Description',
      category: 'electronics',
      images: ['http://example.com/image.jpg'],
      brand: 'Test Brand',
    };

    it('should create a product and return response DTO', async () => {
      mockService.createProduct.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(mockService.createProduct).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual({
        id: mockProduct.id,
        name: mockProduct.name,
        description: mockProduct.description,
        sku: mockProduct.sku,
        price: mockProduct.price.amount,
        currency: mockProduct.price.currency,
        stockQuantity: mockProduct.stockQuantity.value,
        category: mockProduct.category,
        images: mockProduct.images,
        isActive: mockProduct.isActive,
        brand: mockProduct.brand,
        createdAt: mockProduct.createdAt,
        updatedAt: mockProduct.updatedAt,
      });
    });
  });

  describe('findAll', () => {
    it('should return all products as response DTOs', async () => {
      const products = [mockProduct];
      mockService.findAllProducts.mockResolvedValue(products);

      const result = await controller.findAll();

      expect(mockService.findAllProducts).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: mockProduct.id,
        name: mockProduct.name,
        description: mockProduct.description,
        sku: mockProduct.sku,
        price: mockProduct.price.amount,
        currency: mockProduct.price.currency,
        stockQuantity: mockProduct.stockQuantity.value,
        category: mockProduct.category,
        images: mockProduct.images,
        isActive: mockProduct.isActive,
        brand: mockProduct.brand,
        createdAt: mockProduct.createdAt,
        updatedAt: mockProduct.updatedAt,
      });
    });
  });

  describe('findOne', () => {
    it('should return a product by ID as response DTO', async () => {
      mockService.findProductById.mockResolvedValue(mockProduct);

      const result = await controller.findOne('test-id');

      expect(mockService.findProductById).toHaveBeenCalledWith('test-id');
      expect(result).toEqual({
        id: mockProduct.id,
        name: mockProduct.name,
        description: mockProduct.description,
        sku: mockProduct.sku,
        price: mockProduct.price.amount,
        currency: mockProduct.price.currency,
        stockQuantity: mockProduct.stockQuantity.value,
        category: mockProduct.category,
        images: mockProduct.images,
        isActive: mockProduct.isActive,
        brand: mockProduct.brand,
        createdAt: mockProduct.createdAt,
        updatedAt: mockProduct.updatedAt,
      });
    });
  });

  describe('update', () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Updated Product',
      price: 149.99,
    };

    it('should update a product and return response DTO', async () => {
      const updatedProduct = Product.create(
        'Updated Product',
        'TEST-001',
        new Price(149.99, 'USD'),
        new Quantity(10),
        'Updated Description',
        'electronics',
        ['http://example.com/updated.jpg'],
        'Updated Brand'
      );
      mockService.updateProduct.mockResolvedValue(updatedProduct);

      const result = await controller.update('test-id', updateProductDto);

      expect(mockService.updateProduct).toHaveBeenCalledWith('test-id', updateProductDto);
      expect(result).toEqual({
        id: updatedProduct.id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        sku: updatedProduct.sku,
        price: updatedProduct.price.amount,
        currency: updatedProduct.price.currency,
        stockQuantity: updatedProduct.stockQuantity.value,
        category: updatedProduct.category,
        images: updatedProduct.images,
        isActive: updatedProduct.isActive,
        brand: updatedProduct.brand,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt,
      });
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockService.deleteProduct.mockResolvedValue();

      await controller.remove('test-id');

      expect(mockService.deleteProduct).toHaveBeenCalledWith('test-id');
    });
  });
});
