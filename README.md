# Shopping Cart Backend API

A comprehensive shopping cart backend API built with **NestJS**, **MongoDB**, and **TypeScript**. This project implements a robust product management system with full CRUD operations, validation, error handling, and comprehensive testing.

## 🚀 Features

- **Product Management**: Complete CRUD operations for products
- **Domain-Driven Design**: Clean architecture with value objects and entities
- **Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Custom exception handling with proper HTTP status codes
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Testing**: Comprehensive test suite with 69.94% code coverage
- **Type Safety**: Full TypeScript support with strict typing
- **MongoDB Integration**: Mongoose ODM for database operations
- **JSEND Response Format**: Standardized API response format

## 🏗️ Architecture

### Domain Layer
- **Entities**: `Product` entity with business logic
- **Value Objects**: `Price` and `Quantity` with validation
- **Exceptions**: Custom domain exceptions

### Application Layer
- **Services**: Business logic implementation
- **DTOs**: Data transfer objects for API contracts
- **Controllers**: HTTP request/response handling

### Infrastructure Layer
- **Repositories**: Data access abstraction
- **MongoDB Schema**: Database model definitions
- **Configuration**: Environment-based configuration

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **MongoDB** (v5 or higher)
- **Docker** (optional, for containerized development)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BE-NestJS
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/shopping-cart
   
   # Application
   PORT=3000
   NODE_ENV=development
   API_PREFIX=api/v1
   CORS_ORIGIN=http://localhost:4321
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or start your local MongoDB instance
   mongod
   ```

## 🚀 Running the Application

### Development Mode
```bash
pnpm start:dev
# or
npm run start:dev
```

### Production Mode
```bash
pnpm build
pnpm start:prod
# or
npm run build
npm run start:prod
```

### Docker Development
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or using the development Dockerfile
docker build -f Dockerfile.dev -t shopping-cart-backend .
docker run -p 3000:3000 shopping-cart-backend
```

## 📚 API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:3000/api/v1/docs
- **JSON Schema**: http://localhost:3000/api/v1/docs-json

## 🧪 Testing

### Run All Tests
```bash
pnpm test
# or
npm test
```

### Run Tests with Coverage
```bash
pnpm test:cov
# or
npm run test:cov
```

### Run Tests in Watch Mode
```bash
pnpm test:watch
# or
npm run test:watch
```

### Test Coverage Report
The test suite provides comprehensive coverage:
- **Overall Coverage**: 69.94%
- **Value Objects**: 98.82%
- **Product Entity**: 86.76%
- **Product Service**: 83.63%
- **Controllers**: 100%

## 📡 API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/products` | Get all products |
| `GET` | `/api/v1/products/:id` | Get product by ID |
| `POST` | `/api/v1/products` | Create new product |
| `PATCH` | `/api/v1/products/:id` | Update product |
| `DELETE` | `/api/v1/products/:id` | Delete product (soft delete) |

### Request/Response Examples

#### Create Product
```bash
POST /api/v1/products
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced camera system",
  "sku": "IPH15PRO-128-BLK",
  "price": 999.99,
  "currency": "USD",
  "stockQuantity": 100,
  "category": "electronics",
  "images": ["https://example.com/image1.jpg"],
  "brand": "Apple",
  "isActive": true
}
```

#### Update Product
```bash
PATCH /api/v1/products/:id
Content-Type: application/json

{
  "name": "iPhone 15 Pro Max",
  "price": 1099.99,
  "stockQuantity": 50
}
```

## 🏛️ Project Structure

```
src/
├── config/                 # Configuration files
│   ├── app.config.ts
│   ├── database.config.ts
│   └── index.ts
├── products/              # Product module
│   ├── controllers/       # HTTP controllers
│   ├── dto/              # Data transfer objects
│   ├── entities/         # Domain entities
│   ├── repositories/     # Data access layer
│   ├── schemas/          # MongoDB schemas
│   └── services/         # Business logic
├── shared/               # Shared utilities
│   ├── decorators/       # Custom decorators
│   ├── entities/         # Base entities
│   ├── exceptions/       # Custom exceptions
│   ├── interceptors/     # Response interceptors
│   ├── responses/        # Response utilities
│   └── value-objects/    # Value objects
├── app.module.ts         # Root module
└── main.ts              # Application entry point

test/                     # Test files
├── integration/         # Integration tests
├── unit/               # Unit tests
└── setup.ts           # Test setup
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/shopping-cart` |
| `API_PREFIX` | API route prefix | `api/v1` |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:4321` |

### Database Configuration

The application uses MongoDB with Mongoose ODM. The connection is configured in `src/config/database.config.ts`.

## 🛡️ Validation & Error Handling

### Input Validation
- Uses `class-validator` for DTO validation
- Comprehensive validation rules for all fields
- Custom validation messages

### Error Handling
- Custom domain exceptions
- Global exception filter
- Standardized error responses
- Proper HTTP status codes

### Response Format
All API responses follow the JSEND format:
```json
{
  "status": "success|fail|error",
  "data": { ... },
  "message": "Optional message"
}
```

## 🚀 Deployment

### Docker Production Build
```bash
docker build -t shopping-cart-backend .
docker run -p 3000:3000 shopping-cart-backend
```

### Environment Setup for Production
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set appropriate CORS origins
4. Configure logging and monitoring

## 📝 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Follow domain-driven design principles

### Git Workflow
1. Create feature branches from `main`
2. Write tests for new functionality
3. Ensure all tests pass
4. Create pull requests for code review

### Testing Guidelines
- Write unit tests for business logic
- Write integration tests for API endpoints
- Maintain high test coverage
- Use descriptive test names

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the test files for usage examples

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete product management API
- Comprehensive test suite
- Swagger documentation
- Docker support
