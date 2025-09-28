import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Base Domain Exception
 * Custom exception for domain-specific errors
 */
export abstract class DomainException extends HttpException {
  constructor(message: string, status: HttpStatus, code?: number) {
    super(
      {
        message,
        code,
        timestamp: new Date().toISOString(),
      },
      status
    );
  }
}

/**
 * Product Domain Exceptions
 */
export class ProductNotFoundException extends DomainException {
  constructor(identifier: string, identifierType: "id" | "sku" = "id") {
    super(
      `Product with ${identifierType} '${identifier}' not found`,
      HttpStatus.NOT_FOUND,
      4041
    );
  }
}

export class ProductAlreadyExistsException extends DomainException {
  constructor(sku: string) {
    super(
      `Product with SKU '${sku}' already exists`,
      HttpStatus.CONFLICT,
      4091
    );
  }
}

export class InvalidProductDataException extends DomainException {
  constructor(field: string, value: any, reason?: string) {
    const message = reason
      ? `Invalid ${field}: ${reason}`
      : `Invalid ${field} value: ${value}`;

    super(message, HttpStatus.BAD_REQUEST, 4001);
  }
}

export class ProductOperationException extends DomainException {
  constructor(operation: string, reason: string) {
    super(
      `Cannot ${operation} product: ${reason}`,
      HttpStatus.BAD_REQUEST,
      4002
    );
  }
}

/**
 * Value Object Exceptions
 */
export class InvalidPriceException extends DomainException {
  constructor(amount: number, currency?: string) {
    super(
      `Invalid price: ${amount} ${currency || ""}. Price must be positive.`,
      HttpStatus.BAD_REQUEST,
      4003
    );
  }
}

export class InvalidQuantityException extends DomainException {
  constructor(value: number) {
    super(
      `Invalid quantity: ${value}. Quantity must be non-negative.`,
      HttpStatus.BAD_REQUEST,
      4004
    );
  }
}

export class UnsupportedCurrencyException extends DomainException {
  constructor(currency: string) {
    super(`Unsupported currency: ${currency}`, HttpStatus.BAD_REQUEST, 4005);
  }
}
