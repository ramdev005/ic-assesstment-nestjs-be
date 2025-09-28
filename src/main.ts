import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { GlobalExceptionFilter } from "@/shared/exceptions";
import { ResponseInterceptor } from "@/shared/interceptors";

/**
 * Application Bootstrap
 * Initializes and configures the NestJS application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const validationErrors = errors.map((error) => {
          const constraints = error.constraints || {};
          return {
            property: error.property,
            value: error.value,
            constraints: Object.values(constraints),
          };
        });

        return {
          message: "Validation failed",
          errors: validationErrors,
        };
      },
    })
  );

  // CORS configuration
  app.enableCors({
    origin: configService.get("app.corsOrigin"),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // API prefix
  const apiPrefix = configService.get("app.apiPrefix");
  app.setGlobalPrefix(apiPrefix);

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Shopping Cart API")
    .setDescription(
      "A comprehensive shopping cart API built with NestJS and MongoDB"
    )
    .setVersion("1.0")
    .addTag("Products", "Product management operations")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start server
  const port = configService.get("app.port");
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`
  );
}

bootstrap();
