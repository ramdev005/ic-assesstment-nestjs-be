import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsModule } from "@/products";
import databaseConfig from "@/config/database.config";
import appConfig from "@/config/app.config";

/**
 * Application Root Module
 * Configures the main application module with all feature modules
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: [".env.local", ".env"],
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.MONGODB_URI || "mongodb://localhost:27017/shopping_cart",
        dbName: process.env.MONGODB_DATABASE || "shopping_cart",
      }),
    }),
    ProductsModule,
  ],
})
export class AppModule {}
