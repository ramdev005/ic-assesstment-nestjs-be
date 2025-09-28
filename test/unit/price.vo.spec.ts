import { Price } from "../../src/shared/value-objects/price.vo";

describe("Price Value Object", () => {
  describe("constructor", () => {
    it("should create a price with valid amount and default currency", () => {
      const price = new Price(99.99);
      expect(price.amount).toBe(99.99);
      expect(price.currency).toBe("USD");
    });

    it("should create a price with custom currency", () => {
      const price = new Price(99.99, "EUR");
      expect(price.amount).toBe(99.99);
      expect(price.currency).toBe("EUR");
    });

    it("should round amount to 2 decimal places", () => {
      const price = new Price(99.999);
      expect(price.amount).toBe(100);
    });

    it("should throw error for negative amount", () => {
      expect(() => new Price(-10)).toThrow("Invalid price: -10 . Price must be positive.");
    });

    it("should throw error for zero amount", () => {
      expect(() => new Price(0)).toThrow("Invalid price: 0 . Price must be positive.");
    });

    it("should convert currency to uppercase", () => {
      const price = new Price(99.99, "usd");
      expect(price.currency).toBe("USD");
    });
  });

  describe("equals", () => {
    it("should return true for equal prices", () => {
      const price1 = new Price(99.99, "USD");
      const price2 = new Price(99.99, "USD");
      expect(price1.equals(price2)).toBe(true);
    });

    it("should return false for different amounts", () => {
      const price1 = new Price(99.99, "USD");
      const price2 = new Price(100.0, "USD");
      expect(price1.equals(price2)).toBe(false);
    });

    it("should return false for different currencies", () => {
      const price1 = new Price(99.99, "USD");
      const price2 = new Price(99.99, "EUR");
      expect(price1.equals(price2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return formatted price string", () => {
      const price = new Price(99.99, "USD");
      expect(price.toString()).toBe("USD 99.99");
    });
  });

  describe("fromString", () => {
    it("should create price from string", () => {
      const price = Price.fromString("USD 99.99");
      expect(price.amount).toBe(99.99);
      expect(price.currency).toBe("USD");
    });
  });
});
