import { Quantity } from '../quantity.vo';
import { InvalidQuantityException } from '../../exceptions';

describe('Quantity Value Object', () => {
  describe('constructor', () => {
    it('should create a valid quantity', () => {
      const quantity = new Quantity(10);
      expect(quantity.value).toBe(10);
    });

    it('should accept zero quantity', () => {
      const quantity = new Quantity(0);
      expect(quantity.value).toBe(0);
    });

    it('should throw error for negative quantity', () => {
      expect(() => new Quantity(-1)).toThrow(InvalidQuantityException);
    });

    it('should throw error for non-integer quantity', () => {
      expect(() => new Quantity(10.5)).toThrow(InvalidQuantityException);
    });

    it('should throw error for NaN quantity', () => {
      expect(() => new Quantity(NaN)).toThrow(InvalidQuantityException);
    });

    it('should throw error for quantity exceeding maximum', () => {
      expect(() => new Quantity(1000001)).toThrow(InvalidQuantityException);
    });
  });

  describe('equals', () => {
    it('should return true for equal quantities', () => {
      const quantity1 = new Quantity(10);
      const quantity2 = new Quantity(10);
      expect(quantity1.equals(quantity2)).toBe(true);
    });

    it('should return false for different quantities', () => {
      const quantity1 = new Quantity(10);
      const quantity2 = new Quantity(20);
      expect(quantity1.equals(quantity2)).toBe(false);
    });
  });

  describe('arithmetic operations', () => {
    it('should add quantities correctly', () => {
      const quantity1 = new Quantity(10);
      const quantity2 = new Quantity(5);
      const result = quantity1.add(quantity2);

      expect(result.value).toBe(15);
    });

    it('should subtract quantities correctly', () => {
      const quantity1 = new Quantity(10);
      const quantity2 = new Quantity(3);
      const result = quantity1.subtract(quantity2);

      expect(result.value).toBe(7);
    });

    it('should throw error when subtraction results in negative', () => {
      const quantity1 = new Quantity(5);
      const quantity2 = new Quantity(10);

      expect(() => quantity1.subtract(quantity2)).toThrow(InvalidQuantityException);
    });

    it('should multiply quantity correctly', () => {
      const quantity = new Quantity(10);
      const result = quantity.multiply(3);

      expect(result.value).toBe(30);
    });

    it('should throw error for invalid multiplication factor', () => {
      const quantity = new Quantity(10);

      expect(() => quantity.multiply(-1)).toThrow(InvalidQuantityException);
      expect(() => quantity.multiply(0.33)).toThrow(InvalidQuantityException); // 10 * 0.33 = 3.3 (not an integer)
      expect(() => quantity.multiply(NaN)).toThrow(InvalidQuantityException);
    });
  });

  describe('comparison methods', () => {
    it('should compare quantities correctly', () => {
      const quantity1 = new Quantity(10);
      const quantity2 = new Quantity(20);

      expect(quantity2.isGreaterThan(quantity1)).toBe(true);
      expect(quantity1.isLessThan(quantity2)).toBe(true);
      expect(quantity1.isGreaterThan(quantity2)).toBe(false);
    });

    it('should check if quantity is sufficient', () => {
      const quantity1 = new Quantity(10);
      const quantity2 = new Quantity(5);
      const quantity3 = new Quantity(15);

      expect(quantity1.isSufficientFor(quantity2)).toBe(true);
      expect(quantity1.isSufficientFor(quantity1)).toBe(true);
      expect(quantity1.isSufficientFor(quantity3)).toBe(false);
    });
  });

  describe('state checking methods', () => {
    it('should check if quantity is zero', () => {
      const zeroQuantity = new Quantity(0);
      const nonZeroQuantity = new Quantity(10);

      expect(zeroQuantity.isZero()).toBe(true);
      expect(nonZeroQuantity.isZero()).toBe(false);
    });

    it('should check if quantity is positive', () => {
      const zeroQuantity = new Quantity(0);
      const positiveQuantity = new Quantity(10);

      expect(zeroQuantity.isPositive()).toBe(false);
      expect(positiveQuantity.isPositive()).toBe(true);
    });
  });

  describe('toString', () => {
    it('should convert to string correctly', () => {
      const quantity = new Quantity(10);
      expect(quantity.toString()).toBe('10');
    });
  });
});
