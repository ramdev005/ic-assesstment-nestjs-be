import { Injectable, Inject } from "@nestjs/common";
import { Product } from "@/products/entities";
import { ProductRepository, PRODUCT_REPOSITORY } from "@/products/repositories";
import { CreateProductDto, UpdateProductDto } from "@/products/dto";
import { Price, Quantity } from "@/shared/value-objects";
import {
  ProductNotFoundException,
  ProductAlreadyExistsException,
  ProductOperationException,
} from "@/shared/exceptions";

/**
 * Product Domain Service
 * Contains business logic for product operations
 */
@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    // Check if SKU already exists
    const existingProduct = await this.productRepository.findBySku(
      createProductDto.sku
    );
    if (existingProduct) {
      throw new ProductAlreadyExistsException(createProductDto.sku);
    }

    // Create value objects
    const price = new Price(
      createProductDto.price,
      createProductDto.currency || "USD"
    );
    const stockQuantity = new Quantity(createProductDto.stockQuantity);

    // Create product entity
    const product = Product.create(
      createProductDto.name,
      createProductDto.sku,
      price,
      stockQuantity,
      createProductDto.description,
      createProductDto.category,
      createProductDto.images,
      createProductDto.brand
    );

    return await this.productRepository.save(product);
  }

  async findAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundException(id, "id");
    }
    return product;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const existingProduct = await this.findProductById(id);

    // Check if SKU is being updated and if it already exists
    if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
      const skuExists = await this.productRepository.findBySku(
        updateProductDto.sku
      );
      if (skuExists) {
        throw new ProductAlreadyExistsException(updateProductDto.sku);
      }
    }

    // Update product properties
    if (updateProductDto.name !== undefined) {
      existingProduct.updateName(updateProductDto.name);
    }
    if (updateProductDto.description !== undefined) {
      existingProduct.updateDescription(updateProductDto.description);
    }
    if (updateProductDto.sku !== undefined) {
      existingProduct.updateSku(updateProductDto.sku);
    }
    if (updateProductDto.price !== undefined || updateProductDto.currency !== undefined) {
      const price = new Price(
        updateProductDto.price !== undefined ? updateProductDto.price : existingProduct.price.amount,
        updateProductDto.currency || existingProduct.price.currency
      );
      existingProduct.updatePrice(price);
    }
    if (updateProductDto.stockQuantity !== undefined) {
      const stockQuantity = new Quantity(updateProductDto.stockQuantity);
      existingProduct.updateStockQuantity(stockQuantity);
    }
    if (updateProductDto.category !== undefined) {
      existingProduct.updateCategory(updateProductDto.category);
    }
    if (updateProductDto.images !== undefined) {
      existingProduct.updateImages(updateProductDto.images);
    }
    if (updateProductDto.brand !== undefined) {
      existingProduct.updateBrand(updateProductDto.brand);
    }
    if (updateProductDto.isActive !== undefined) {
      if (updateProductDto.isActive) {
        existingProduct.activate();
      }
      // Note: Deactivation is not supported - products can only be activated or deleted
    }

    // Use update method instead of save for existing entities
    const updatedProduct = await this.productRepository.update(
      id,
      existingProduct
    );
    if (!updatedProduct) {
      throw new ProductOperationException(
        "update",
        `Failed to update product with ID '${id}'`
      );
    }

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.findProductById(id);
    product.softDelete();
    await this.productRepository.update(id, product);
  }
}
