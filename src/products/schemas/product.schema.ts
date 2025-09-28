import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ProductDocument = ProductSchema & Document;

@Schema({ timestamps: true })
export class ProductSchema {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ trim: true, maxlength: 1000 })
  description?: string;

  @Prop({ required: true, unique: true, trim: true, maxlength: 50 })
  sku: string;

  @Prop({ required: true, min: 0.01 })
  price: number;

  @Prop({ required: true, default: "USD" })
  currency: string;

  @Prop({ required: true, min: 0 })
  stockQuantity: number;

  @Prop({ trim: true, maxlength: 50 })
  category?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ trim: true, maxlength: 50 })
  brand?: string;
}

export const ProductSchemaFactory = SchemaFactory.createForClass(ProductSchema);

// Add indexes for better query performance
// Note: sku index is automatically created by unique: true property
ProductSchemaFactory.index({ name: "text", description: "text" });
ProductSchemaFactory.index({ category: 1 });
ProductSchemaFactory.index({ isActive: 1 });
ProductSchemaFactory.index({ isDeleted: 1 });
ProductSchemaFactory.index({ price: 1 });
ProductSchemaFactory.index({ stockQuantity: 1 });
