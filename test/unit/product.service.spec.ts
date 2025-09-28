import { Test, TestingModule } from "@nestjs/testing";
import { 
  ProductAlreadyExistsException, 
  ProductNotFoundException,
  ProductOperationException 
} from "../../src/shared/exceptions";
import { ProductService } from "../../src/products/services/product.service";
import {
  ProductRepository,
  PRODUCT_REPOSITORY,
} from "../../src/products/repositories";
import { Product } from "../../src/products/entities";
import { CreateProductDto, UpdateProductDto } from "../../src/products/dto";
import { Price, Quantity } from "../../src/shared/value-objects";

describe("ProductService", () => {
  let service: ProductService;
  let repository: jest.Mocked<ProductRepository>;

  const mockProduct = new Product(
    "Test Product",
    "TEST-SKU-001",
    new Price(99.99, "USD"),
    new Quantity(100),
    "507f1f77bcf86cd799439011"
  );

  beforeEach(async () => {
    const mockRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      findBySku: jest.fn(),
      findByName: jest.fn(),
      findByCategory: jest.fn(),
      findActiveProducts: jest.fn(),
      findInStockProducts: jest.fn(),
      findByPriceRange: jest.fn(),
      searchProducts: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get(PRODUCT_REPOSITORY);
  });

  describe("createProduct", () => {
    const createProductDto: CreateProductDto = {
      name: "Test Product",
      sku: "TEST-SKU-001",
      price: 99.99,
      stockQuantity: 100,
      description: "Test description",
      category: "Test Category",
      images: ["https://example.com/image.jpg"],
      brand: "Test Brand",
      currency: "USD",
    };

    it("should create a product successfully", async () => {
      repository.findBySku.mockResolvedValue(null);
      repository.save.mockResolvedValue(mockProduct);

      const result = await service.createProduct(createProductDto);

      expect(repository.findBySku).toHaveBeenCalledWith("TEST-SKU-001");
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it("should throw ProductAlreadyExistsException if SKU already exists", async () => {
      repository.findBySku.mockResolvedValue(mockProduct);

      await expect(service.createProduct(createProductDto)).rejects.toThrow(
        ProductAlreadyExistsException
      );
    });
  });

  describe("findProductById", () => {
    it("should return product if found", async () => {
      repository.findById.mockResolvedValue(mockProduct);

      const result = await service.findProductById("507f1f77bcf86cd799439011");

      expect(repository.findById).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011"
      );
      expect(result).toEqual(mockProduct);
    });

    it("should throw ProductNotFoundException if product not found", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.findProductById("507f1f77bcf86cd799439011")
      ).rejects.toThrow(ProductNotFoundException);
    });
  });

  describe("updateProduct", () => {
    const updateProductDto: UpdateProductDto = {
      name: "Updated Product",
      price: 149.99,
    };

    it("should update product successfully", async () => {
      repository.findById.mockResolvedValue(mockProduct);
      repository.findBySku.mockResolvedValue(null);
      repository.update.mockResolvedValue(mockProduct);

      const result = await service.updateProduct(
        "507f1f77bcf86cd799439011",
        updateProductDto
      );

      expect(repository.findById).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011"
      );
      expect(repository.update).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it("should throw ProductNotFoundException if product not found", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.updateProduct("507f1f77bcf86cd799439011", updateProductDto)
      ).rejects.toThrow(ProductNotFoundException);
    });

    it("should throw ProductAlreadyExistsException if SKU already exists", async () => {
      const updateWithSku: UpdateProductDto = {
        sku: "EXISTING-SKU",
      };

      repository.findById.mockResolvedValue(mockProduct);
      repository.findBySku.mockResolvedValue(mockProduct);

      await expect(
        service.updateProduct("507f1f77bcf86cd799439011", updateWithSku)
      ).rejects.toThrow(ProductAlreadyExistsException);
    });
  });

  describe("deleteProduct", () => {
    it("should delete product successfully", async () => {
      repository.findById.mockResolvedValue(mockProduct);
      repository.update.mockResolvedValue(mockProduct);
      const softDeleteSpy = jest.spyOn(mockProduct, 'softDelete').mockImplementation(() => {});

      await service.deleteProduct("507f1f77bcf86cd799439011");

      expect(repository.findById).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011"
      );
      expect(softDeleteSpy).toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011",
        mockProduct
      );
    });

    it("should throw ProductNotFoundException if product not found", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.deleteProduct("507f1f77bcf86cd799439011")
      ).rejects.toThrow(ProductNotFoundException);
    });
  });

  describe("findAllProducts", () => {
    it("should return all products", async () => {
      const products = [mockProduct];
      repository.findAll.mockResolvedValue(products);

      const result = await service.findAllProducts();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });
});
