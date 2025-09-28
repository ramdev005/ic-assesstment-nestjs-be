import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from '@/products/controllers';
import { ProductService } from '@/products/services';
import { ProductRepositoryImpl, ProductRepository, PRODUCT_REPOSITORY } from '@/products/repositories';
import { ProductSchema, ProductSchemaFactory } from '@/products/schemas';

/**
 * Products Module
 * Configures the products feature module with all its dependencies
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSchema.name, schema: ProductSchemaFactory },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepositoryImpl,
    },
  ],
  exports: [ProductService, PRODUCT_REPOSITORY],
})
export class ProductsModule {}
