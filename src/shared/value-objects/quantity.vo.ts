import { IsNumber, IsInt, Min } from "class-validator";
import { InvalidQuantityException } from "@/shared/exceptions";

/**
 * Quantity Value Object
 * Represents a non-negative integer quantity
 * Enforces business rules and validation
 */
export class Quantity {
  @IsNumber()
  @IsInt()
  @Min(0)
  private readonly _value: number;

  constructor(value: number) {
    this.validateQuantity(value);
    this._value = value;
  }

  private validateQuantity(value: number): void {
    if (typeof value !== "number" || isNaN(value)) {
      throw new InvalidQuantityException(value);
    }

    if (!Number.isInteger(value)) {
      throw new InvalidQuantityException(value);
    }

    if (value < 0) {
      throw new InvalidQuantityException(value);
    }

    if (value > 1000000) {
      throw new InvalidQuantityException(value);
    }
  }

  get value(): number {
    return this._value;
  }

  equals(other: Quantity): boolean {
    return this._value === other._value;
  }

  add(other: Quantity): Quantity {
    return new Quantity(this._value + other._value);
  }

  subtract(other: Quantity): Quantity {
    const result = this._value - other._value;
    if (result < 0) {
      throw new InvalidQuantityException(result);
    }
    return new Quantity(result);
  }

  /**
   * Multiply quantity by a factor
   */
  multiply(factor: number): Quantity {
    if (typeof factor !== "number" || isNaN(factor) || factor < 0) {
      throw new InvalidQuantityException(factor);
    }

    const result = this._value * factor;
    if (!Number.isInteger(result)) {
      throw new InvalidQuantityException(result);
    }

    return new Quantity(result);
  }

  /**
   * Check if quantity is sufficient for operation
   */
  isSufficientFor(required: Quantity): boolean {
    return this._value >= required._value;
  }

  /**
   * Compare quantities
   */
  isGreaterThan(other: Quantity): boolean {
    return this._value > other._value;
  }

  isLessThan(other: Quantity): boolean {
    return this._value < other._value;
  }

  isZero(): boolean {
    return this._value === 0;
  }

  isPositive(): boolean {
    return this._value > 0;
  }

  toString(): string {
    return this._value.toString();
  }
}
