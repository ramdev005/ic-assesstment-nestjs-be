import { BaseRepository } from "@/shared/repositories/base.repository";
import { Product } from "@/products/entities";

/**
 * Product Repository Interface
 * Defines product-specific repository operations
 */
export interface ProductRepository extends BaseRepository<Product> {
  findBySku(sku: string): Promise<Product | null>;
  findByName(name: string): Promise<Product[]>;
  findByCategory(category: string): Promise<Product[]>;
  findActiveProducts(): Promise<Product[]>;
  findInStockProducts(): Promise<Product[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
}

/**
 * Product Repository Token
 * Used for dependency injection
 */
export const PRODUCT_REPOSITORY = "ProductRepository";
