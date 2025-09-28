import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsArray,
  IsUrl,
  IsBoolean,
  Min,
  MaxLength,
  ValidateIf,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * Create Product DTO
 * Data Transfer Object for creating a new product
 */
export class CreateProductDto {
  @ApiProperty({
    description: "Product name",
    example: "iPhone 15 Pro",
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: "Product description",
    example: "Latest iPhone with advanced camera system",
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: "Product SKU (Stock Keeping Unit)",
    example: "IPH15PRO-128-BLK",
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku: string;

  @ApiProperty({
    description: "Product price",
    example: 999.99,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  price: number;

  @ApiProperty({
    description: "Stock quantity",
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiPropertyOptional({
    description: "Product category",
    example: "Electronics",
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({
    description: "Product images URLs",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @ValidateIf((o) => o.images && o.images.length > 0)
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: "Product brand",
    example: "Apple",
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  brand?: string;

  @ApiPropertyOptional({
    description: "Product currency",
    example: "USD",
    default: "USD",
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({
    description: "Whether the product is active",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
