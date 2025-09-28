import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { ProductRepository, PRODUCT_REPOSITORY } from '../../repositories';
import { Product } from '../../entities';
import { Price, Quantity } from '../../../shared/value-objects';
import {
  ProductNotFoundException,
  ProductAlreadyExistsException,
  ProductOperationException,
} from '../../../shared/exceptions';
import { CreateProductDto, UpdateProductDto } from '../../dto';

describe('ProductService', () => {
  let service: ProductService;
  let mockRepository: jest.Mocked<ProductRepository>;

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
    const mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySku: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    mockRepository = module.get(PRODUCT_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
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

    it('should create a product successfully', async () => {
      mockRepository.findBySku.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue(mockProduct);

      const result = await service.createProduct(createProductDto);

      expect(mockRepository.findBySku).toHaveBeenCalledWith('TEST-001');
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Product));
      expect(result).toBe(mockProduct);
    });

    it('should throw ProductAlreadyExistsException if SKU exists', async () => {
      mockRepository.findBySku.mockResolvedValue(mockProduct);

      await expect(service.createProduct(createProductDto)).rejects.toThrow(
        ProductAlreadyExistsException
      );

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should use default currency if not provided', async () => {
      const dtoWithoutCurrency = { ...createProductDto };
      delete dtoWithoutCurrency.currency;

      mockRepository.findBySku.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue(mockProduct);

      await service.createProduct(dtoWithoutCurrency);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          price: expect.objectContaining({
            _currency: 'USD',
          }),
        })
      );
    });
  });

  describe('findAllProducts', () => {
    it('should return all products', async () => {
      const products = [mockProduct];
      mockRepository.findAll.mockResolvedValue(products);

      const result = await service.findAllProducts();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(products);
    });
  });

  describe('findProductById', () => {
    it('should return product if found', async () => {
      mockRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.findProductById('test-id');

      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
      expect(result).toBe(mockProduct);
    });

    it('should throw ProductNotFoundException if not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findProductById('non-existent')).rejects.toThrow(
        ProductNotFoundException
      );
    });
  });

  describe('updateProduct', () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Updated Product',
      price: 149.99,
    };

    it('should update product successfully', async () => {
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
      mockRepository.findById.mockResolvedValue(mockProduct);
      mockRepository.findBySku.mockResolvedValue(null);
      mockRepository.update.mockResolvedValue(updatedProduct);

      const result = await service.updateProduct('test-id', updateProductDto);

      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockRepository.update).toHaveBeenCalledWith('test-id', expect.any(Product));
      expect(result).toBe(updatedProduct);
    });

    it('should throw ProductNotFoundException if product not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateProduct('non-existent', updateProductDto)
      ).rejects.toThrow(ProductNotFoundException);
    });

    it('should throw ProductAlreadyExistsException if SKU already exists', async () => {
      const anotherProduct = Product.create(
        'Another Product',
        'TEST-001',
        new Price(99.99, 'USD'),
        new Quantity(5),
        'Another Description',
        'electronics',
        ['http://example.com/another.jpg'],
        'Another Brand'
      );
      mockRepository.findById.mockResolvedValue(mockProduct);
      mockRepository.findBySku.mockResolvedValue(anotherProduct);

      const updateWithSku = { ...updateProductDto, sku: 'EXISTING-SKU' };

      await expect(
        service.updateProduct('test-id', updateWithSku)
      ).rejects.toThrow(ProductAlreadyExistsException);
    });

    it('should throw ProductOperationException if update fails', async () => {
      mockRepository.findById.mockResolvedValue(mockProduct);
      mockRepository.findBySku.mockResolvedValue(null);
      mockRepository.update.mockResolvedValue(null);

      await expect(
        service.updateProduct('test-id', updateProductDto)
      ).rejects.toThrow(ProductOperationException);
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete product successfully', async () => {
      const deletedProduct = Product.create(
        'Test Product',
        'TEST-001', 
        new Price(99.99, 'USD'),
        new Quantity(10),
        'Test Description',
        'electronics',
        ['http://example.com/image.jpg'],
        'Test Brand'
      );
      mockRepository.findById.mockResolvedValue(mockProduct);
      mockRepository.update.mockResolvedValue(deletedProduct);

      // Mock the softDelete method
      jest.spyOn(mockProduct, 'softDelete').mockImplementation(() => {});

      await service.deleteProduct('test-id');

      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockProduct.softDelete).toHaveBeenCalled();
      expect(mockRepository.update).toHaveBeenCalledWith('test-id', mockProduct);
    });

    it('should throw ProductNotFoundException if product not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.deleteProduct('non-existent')).rejects.toThrow(
        ProductNotFoundException
      );
    });
  });
});
