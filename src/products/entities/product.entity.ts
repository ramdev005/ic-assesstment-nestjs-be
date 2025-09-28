import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUrl,
} from "class-validator";
import { BaseEntity } from "@/shared/entities";
import { Price, Quantity } from "@/shared/value-objects";

/**
 * Product Entity
 * Represents a product in the shopping cart system
 */
export class Product extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  private _name: string;

  @IsString()
  @IsOptional()
  private _description?: string;

  @IsString()
  @IsNotEmpty()
  private _sku: string;

  private _price: Price;

  private _stockQuantity: Quantity;

  @IsString()
  @IsOptional()
  private _category?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  private _images?: string[];

  @IsBoolean()
  private _isActive: boolean;

  @IsBoolean()
  private _isDeleted: boolean;

  @IsString()
  @IsOptional()
  private _brand?: string;

  constructor(
    name: string,
    sku: string,
    price: Price,
    stockQuantity: Quantity,
    id?: string,
    description?: string,
    category?: string,
    images?: string[],
    brand?: string,
    isActive?: boolean,
    isDeleted?: boolean
  ) {
    super(id);
    this._name = name;
    this._sku = sku;
    this._price = price;
    this._stockQuantity = stockQuantity;
    this._description = description;
    this._category = category;
    this._images = images || [];
    this._brand = brand;
    this._isActive = isActive !== undefined ? isActive : true;
    this._isDeleted = isDeleted !== undefined ? isDeleted : false;
  }

  // Getters
  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get sku(): string {
    return this._sku;
  }

  get price(): Price {
    return this._price;
  }

  get stockQuantity(): Quantity {
    return this._stockQuantity;
  }

  get category(): string | undefined {
    return this._category;
  }

  get images(): string[] {
    return this._images || [];
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  get brand(): string | undefined {
    return this._brand;
  }

  // Business Methods
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Product name cannot be empty");
    }
    this._name = name.trim();
    this.updateTimestamp();
  }

  updateDescription(description: string): void {
    this._description = description?.trim() || undefined;
    this.updateTimestamp();
  }

  updateSku(sku: string): void {
    if (!sku || sku.trim().length === 0) {
      throw new Error("Product SKU cannot be empty");
    }
    this._sku = sku.trim();
    this.updateTimestamp();
  }

  updatePrice(price: Price): void {
    this._price = price;
    this.updateTimestamp();
  }

  updateStockQuantity(quantity: Quantity): void {
    this._stockQuantity = quantity;
    this.updateTimestamp();
  }

  updateCategory(category: string): void {
    this._category = category?.trim() || undefined;
    this.updateTimestamp();
  }

  updateImages(images: string[]): void {
    this._images = images || [];
    this.updateTimestamp();
  }

  updateBrand(brand: string): void {
    this._brand = brand?.trim() || undefined;
    this.updateTimestamp();
  }

  activate(): void {
    this._isActive = true;
    this.updateTimestamp();
  }

  softDelete(): void {
    this._isDeleted = true;
    this.updateTimestamp();
  }

  restore(): void {
    this._isDeleted = false;
    this.updateTimestamp();
  }

  isInStock(): boolean {
    return this._stockQuantity.isPositive();
  }

  canReduceStock(quantity: Quantity): boolean {
    return this._stockQuantity.value >= quantity.value;
  }

  reduceStock(quantity: Quantity): void {
    if (!this.canReduceStock(quantity)) {
      throw new Error("Insufficient stock");
    }
    this._stockQuantity = this._stockQuantity.subtract(quantity);
    this.updateTimestamp();
  }

  addStock(quantity: Quantity): void {
    this._stockQuantity = this._stockQuantity.add(quantity);
    this.updateTimestamp();
  }

  // Factory method
  static create(
    name: string,
    sku: string,
    price: Price,
    stockQuantity: Quantity,
    description?: string,
    category?: string,
    images?: string[],
    brand?: string
  ): Product {
    return new Product(
      name,
      sku,
      price,
      stockQuantity,
      undefined,
      description,
      category,
      images,
      brand
    );
  }
}
