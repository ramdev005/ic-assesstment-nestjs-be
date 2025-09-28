import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/**
 * Update Product DTO
 * Data Transfer Object for updating an existing product
 * Inherits all properties from CreateProductDto but makes them optional
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
