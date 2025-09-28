import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Product Response DTO
 * Data Transfer Object for product API responses
 */
export class ProductResponseDto {
  @ApiProperty({
    description: 'Product unique identifier',
    example: '507f1f77bcf86cd799439011'
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro'
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Latest iPhone with advanced camera system'
  })
  description?: string;

  @ApiProperty({
    description: 'Product SKU',
    example: 'IPH15PRO-128-BLK'
  })
  sku: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99
  })
  price: number;

  @ApiProperty({
    description: 'Product currency',
    example: 'USD'
  })
  currency: string;

  @ApiProperty({
    description: 'Stock quantity',
    example: 100
  })
  stockQuantity: number;

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'Electronics'
  })
  category?: string;

  @ApiPropertyOptional({
    description: 'Product images URLs',
    example: ['https://example.com/image1.jpg']
  })
  images?: string[];

  @ApiProperty({
    description: 'Product active status',
    example: true
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'Apple'
  })
  brand?: string;

  @ApiProperty({
    description: 'Product creation date',
    example: '2024-01-15T10:30:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Product last update date',
    example: '2024-01-15T10:30:00.000Z'
  })
  updatedAt: Date;
}
