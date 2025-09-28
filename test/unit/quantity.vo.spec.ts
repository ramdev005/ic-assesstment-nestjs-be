import { Quantity } from "../../src/shared/value-objects/quantity.vo";

describe("Quantity Value Object", () => {
  describe("constructor", () => {
    it("should create a quantity with valid value", () => {
      const quantity = new Quantity(10);
      expect(quantity.value).toBe(10);
    });

    it("should create a quantity with zero value", () => {
      const quantity = new Quantity(0);
      expect(quantity.value).toBe(0);
    });

    it("should throw error for negative value", () => {
      expect(() => new Quantity(-1)).toThrow("Invalid quantity: -1. Quantity must be non-negative.");
    });

    it("should throw error for non-integer value", () => {
      expect(() => new Quantity(10.5)).toThrow("Invalid quantity: 10.5. Quantity must be non-negative.");
    });
  });

  describe("equals", () => {
    it("should return true for equal quantities", () => {
      const q1 = new Quantity(10);
      const q2 = new Quantity(10);
      expect(q1.equals(q2)).toBe(true);
    });

    it("should return false for different quantities", () => {
      const q1 = new Quantity(10);
      const q2 = new Quantity(20);
      expect(q1.equals(q2)).toBe(false);
    });
  });

  describe("add", () => {
    it("should add two quantities", () => {
      const q1 = new Quantity(10);
      const q2 = new Quantity(5);
      const result = q1.add(q2);
      expect(result.value).toBe(15);
    });

    it("should add zero quantity", () => {
      const q1 = new Quantity(10);
      const q2 = new Quantity(0);
      const result = q1.add(q2);
      expect(result.value).toBe(10);
    });
  });

  describe("subtract", () => {
    it("should subtract two quantities", () => {
      const q1 = new Quantity(10);
      const q2 = new Quantity(3);
      const result = q1.subtract(q2);
      expect(result.value).toBe(7);
    });

    it("should throw error when result would be negative", () => {
      const q1 = new Quantity(5);
      const q2 = new Quantity(10);
      expect(() => q1.subtract(q2)).toThrow(
        "Invalid quantity: -5. Quantity must be non-negative."
      );
    });

    it("should subtract to zero", () => {
      const q1 = new Quantity(5);
      const q2 = new Quantity(5);
      const result = q1.subtract(q2);
      expect(result.value).toBe(0);
    });
  });

  describe("isZero", () => {
    it("should return true for zero quantity", () => {
      const quantity = new Quantity(0);
      expect(quantity.isZero()).toBe(true);
    });

    it("should return false for non-zero quantity", () => {
      const quantity = new Quantity(5);
      expect(quantity.isZero()).toBe(false);
    });
  });

  describe("isPositive", () => {
    it("should return true for positive quantity", () => {
      const quantity = new Quantity(5);
      expect(quantity.isPositive()).toBe(true);
    });

    it("should return false for zero quantity", () => {
      const quantity = new Quantity(0);
      expect(quantity.isPositive()).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return string representation", () => {
      const quantity = new Quantity(10);
      expect(quantity.toString()).toBe("10");
    });
  });
});
