import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Product } from "@/products/entities";
import { ProductRepository } from "./product.repository.interface";
import { ProductSchema, ProductDocument } from "@/products/schemas";
import { Price, Quantity } from "@/shared/value-objects";

/**
 * Product Repository Implementation
 * MongoDB implementation of the ProductRepository interface
 */
@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    @InjectModel(ProductSchema.name)
    private productModel: Model<ProductDocument>
  ) {}

  async findById(id: string): Promise<Product | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const productDoc = await this.productModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    return productDoc ? this.toDomainEntity(productDoc) : null;
  }

  async findAll(): Promise<Product[]> {
    const productDocs = await this.productModel
      .find({ isDeleted: false })
      .exec();
    return productDocs.map((doc) => this.toDomainEntity(doc));
  }

  async save(entity: Product): Promise<Product> {
    const productData = this.toDocument(entity);
    const productDoc = new this.productModel(productData);
    const savedDoc = await productDoc.save();
    return this.toDomainEntity(savedDoc);
  }

  async update(id: string, entity: Partial<Product>): Promise<Product | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const updateData: any = {};

    if (entity.name !== undefined) updateData.name = entity.name;
    if (entity.description !== undefined)
      updateData.description = entity.description;
    if (entity.sku !== undefined) updateData.sku = entity.sku;
    if (entity.price !== undefined) {
      updateData.price = entity.price.amount;
      updateData.currency = entity.price.currency;
    }
    if (entity.stockQuantity !== undefined) {
      updateData.stockQuantity = entity.stockQuantity.value;
    }
    if (entity.category !== undefined) updateData.category = entity.category;
    if (entity.images !== undefined) updateData.images = entity.images;
    if (entity.isActive !== undefined) updateData.isActive = entity.isActive;
    if (entity.isDeleted !== undefined) updateData.isDeleted = entity.isDeleted;
    if (entity.brand !== undefined) updateData.brand = entity.brand;

    const updatedDoc = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.productModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async exists(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const count = await this.productModel.countDocuments({ _id: id }).exec();
    return count > 0;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const productDoc = await this.productModel
      .findOne({ sku, isDeleted: false })
      .exec();
    return productDoc ? this.toDomainEntity(productDoc) : null;
  }

  async findByName(name: string): Promise<Product[]> {
    const productDocs = await this.productModel
      .find({ name: { $regex: name, $options: "i" }, isDeleted: false })
      .exec();
    return productDocs.map((doc) => this.toDomainEntity(doc));
  }

  async findByCategory(category: string): Promise<Product[]> {
    const productDocs = await this.productModel
      .find({ category: { $regex: category, $options: "i" }, isDeleted: false })
      .exec();
    return productDocs.map((doc) => this.toDomainEntity(doc));
  }

  async findActiveProducts(): Promise<Product[]> {
    const productDocs = await this.productModel
      .find({ isActive: true, isDeleted: false })
      .exec();
    return productDocs.map((doc) => this.toDomainEntity(doc));
  }

  async findInStockProducts(): Promise<Product[]> {
    const productDocs = await this.productModel
      .find({ stockQuantity: { $gt: 0 }, isDeleted: false })
      .exec();
    return productDocs.map((doc) => this.toDomainEntity(doc));
  }

  async findByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<Product[]> {
    const productDocs = await this.productModel
      .find({ price: { $gte: minPrice, $lte: maxPrice }, isDeleted: false })
      .exec();
    return productDocs.map((doc) => this.toDomainEntity(doc));
  }

  async searchProducts(query: string): Promise<Product[]> {
    const productDocs = await this.productModel
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { brand: { $regex: query, $options: "i" } },
        ],
        isDeleted: false,
      })
      .exec();
    return productDocs.map((doc) => this.toDomainEntity(doc));
  }

  private toDomainEntity(doc: ProductDocument): Product {
    const price = new Price(doc.price, doc.currency);
    const stockQuantity = new Quantity(doc.stockQuantity);

    return new Product(
      doc.name,
      doc.sku,
      price,
      stockQuantity,
      doc._id.toString(),
      doc.description,
      doc.category,
      doc.images,
      doc.brand,
      doc.isActive,
      doc.isDeleted
    );
  }

  private toDocument(entity: Product): any {
    return {
      name: entity.name,
      description: entity.description,
      sku: entity.sku,
      price: entity.price.amount,
      currency: entity.price.currency,
      stockQuantity: entity.stockQuantity.value,
      category: entity.category,
      images: entity.images,
      isActive: entity.isActive,
      isDeleted: entity.isDeleted,
      brand: entity.brand,
    };
  }
}
