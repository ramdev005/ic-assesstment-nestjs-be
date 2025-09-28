import { IsNumber, IsPositive, Min } from "class-validator";
import {
  InvalidPriceException,
  UnsupportedCurrencyException,
} from "@/shared/exceptions";

/**
 * Supported currencies
 */
const SUPPORTED_CURRENCIES = ["USD", "EUR", "INR", "RUB"] as const;

type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

/**
 * Price Value Object
 * Represents a monetary value with currency
 * Enforces business rules and validation
 */
export class Price {
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  private readonly _amount: number;

  private readonly _currency: SupportedCurrency;

  constructor(amount: number, currency: string = "USD") {
    this.validateAmount(amount);
    this.validateCurrency(currency);

    this._amount = Math.round(amount * 100) / 100; // Round to 2 decimal places
    this._currency = currency.toUpperCase() as SupportedCurrency;
  }

  private validateAmount(amount: number): void {
    if (typeof amount !== "number" || isNaN(amount)) {
      throw new InvalidPriceException(amount);
    }

    if (amount < 0) {
      throw new InvalidPriceException(amount);
    }

    if (amount === 0) {
      throw new InvalidPriceException(amount);
    }

    if (amount > 999999.99) {
      throw new InvalidPriceException(amount, "exceeds maximum allowed value");
    }
  }

  private validateCurrency(currency: string): void {
    if (!currency || typeof currency !== "string") {
      throw new UnsupportedCurrencyException(currency);
    }

    const upperCurrency = currency.toUpperCase();
    if (!SUPPORTED_CURRENCIES.includes(upperCurrency as SupportedCurrency)) {
      throw new UnsupportedCurrencyException(currency);
    }
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  /**
   * Check if this price equals another price
   */
  equals(other: Price): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  /**
   * Compare prices (requires same currency)
   */
  isGreaterThan(other: Price): boolean {
    this.ensureSameCurrency(other);
    return this._amount > other._amount;
  }

  isLessThan(other: Price): boolean {
    this.ensureSameCurrency(other);
    return this._amount < other._amount;
  }

  /**
   * Add two prices (requires same currency)
   */
  add(other: Price): Price {
    this.ensureSameCurrency(other);
    return new Price(this._amount + other._amount, this._currency);
  }

  /**
   * Subtract two prices (requires same currency)
   */
  subtract(other: Price): Price {
    this.ensureSameCurrency(other);
    const result = this._amount - other._amount;
    return new Price(result, this._currency);
  }

  /**
   * Multiply price by a factor
   */
  multiply(factor: number): Price {
    if (typeof factor !== "number" || isNaN(factor) || factor < 0) {
      throw new InvalidPriceException(factor, "Invalid multiplication factor");
    }
    return new Price(this._amount * factor, this._currency);
  }

  private ensureSameCurrency(other: Price): void {
    if (this._currency !== other._currency) {
      throw new InvalidPriceException(
        other._amount,
        `Currency mismatch: ${this._currency} vs ${other._currency}`
      );
    }
  }

  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }

  toJSON(): { amount: number; currency: string } {
    return {
      amount: this._amount,
      currency: this._currency,
    };
  }

  static fromString(priceString: string): Price {
    const parts = priceString.trim().split(" ");
    if (parts.length !== 2) {
      throw new Error('Invalid price format. Expected: "CURRENCY AMOUNT"');
    }

    const [currency, amountStr] = parts;
    const amount = parseFloat(amountStr);

    if (isNaN(amount)) {
      throw new Error("Invalid amount in price string");
    }

    return new Price(amount, currency);
  }

  static getSupportedCurrencies(): readonly string[] {
    return SUPPORTED_CURRENCIES;
  }
}
