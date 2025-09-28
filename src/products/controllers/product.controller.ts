import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from "@nestjs/swagger";
import { ProductService } from "@/products/services";
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from "@/products/dto";
import { Product } from "@/products/entities";

/**
 * Product Controller
 * Handles HTTP requests for product management
 */
@ApiTags("Products")
@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new product",
    description: "Creates a new product with the provided details",
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: "Product created successfully",
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data",
  })
  @ApiResponse({
    status: 409,
    description: "Product with this SKU already exists",
  })
  async create(
    @Body() createProductDto: CreateProductDto
  ): Promise<ProductResponseDto> {
    const product = await this.productService.createProduct(createProductDto);
    return this.toResponseDto(product);
  }

  @Get()
  @ApiOperation({
    summary: "Get all products",
    description: "Retrieves a list of all products",
  })
  @ApiResponse({
    status: 200,
    description: "Products retrieved successfully",
    type: [ProductResponseDto],
  })
  async findAll(): Promise<ProductResponseDto[]> {
    let products: Product[];

    products = await this.productService.findAllProducts();

    return products.map((product) => this.toResponseDto(product));
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get product by ID",
    description: "Retrieves a specific product by its unique identifier",
  })
  @ApiParam({
    name: "id",
    description: "Product unique identifier",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiResponse({
    status: 200,
    description: "Product retrieved successfully",
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Product not found",
  })
  async findOne(@Param("id") id: string): Promise<ProductResponseDto> {
    const product = await this.productService.findProductById(id);
    return this.toResponseDto(product);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update product",
    description: "Updates an existing product with the provided data",
  })
  @ApiParam({
    name: "id",
    description: "Product unique identifier",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: "Product updated successfully",
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data",
  })
  @ApiResponse({
    status: 404,
    description: "Product not found",
  })
  @ApiResponse({
    status: 409,
    description: "Product with this SKU already exists",
  })
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    const product = await this.productService.updateProduct(
      id,
      updateProductDto
    );
    return this.toResponseDto(product);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete product",
    description: "Deletes a product by its unique identifier",
  })
  @ApiParam({
    name: "id",
    description: "Product unique identifier",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiResponse({
    status: 204,
    description: "Product deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Product not found",
  })
  async remove(@Param("id") id: string): Promise<void> {
    await this.productService.deleteProduct(id);
  }

  private toResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price.amount,
      currency: product.price.currency,
      stockQuantity: product.stockQuantity.value,
      category: product.category,
      images: product.images,
      isActive: product.isActive,
      brand: product.brand,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
