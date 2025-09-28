import { Price } from '../price.vo';
import { InvalidPriceException, UnsupportedCurrencyException } from '../../exceptions';

describe('Price Value Object', () => {
  describe('constructor', () => {
    it('should create a valid price', () => {
      const price = new Price(100.50, 'USD');
      expect(price.amount).toBe(100.50);
      expect(price.currency).toBe('USD');
    });

    it('should default to USD currency', () => {
      const price = new Price(50.25);
      expect(price.currency).toBe('USD');
    });

    it('should round to 2 decimal places', () => {
      const price = new Price(99.999);
      expect(price.amount).toBe(100.00);
    });

    it('should throw error for negative amount', () => {
      expect(() => new Price(-10.00)).toThrow(InvalidPriceException);
    });

    it('should throw error for zero amount', () => {
      expect(() => new Price(0)).toThrow(InvalidPriceException);
    });

    it('should throw error for NaN amount', () => {
      expect(() => new Price(NaN)).toThrow(InvalidPriceException);
    });

    it('should throw error for amount exceeding maximum', () => {
      expect(() => new Price(1000000)).toThrow(InvalidPriceException);
    });

    it('should throw error for unsupported currency', () => {
      expect(() => new Price(100, 'INVALID')).toThrow(UnsupportedCurrencyException);
    });

    it('should accept all supported currencies', () => {
      const supportedCurrencies = ['USD', 'EUR', 'INR', 'RUB'];
      supportedCurrencies.forEach(currency => {
        expect(() => new Price(100, currency)).not.toThrow();
      });
    });
  });

  describe('equals', () => {
    it('should return true for equal prices', () => {
      const price1 = new Price(100, 'USD');
      const price2 = new Price(100, 'USD');
      expect(price1.equals(price2)).toBe(true);
    });

    it('should return false for different amounts', () => {
      const price1 = new Price(100, 'USD');
      const price2 = new Price(200, 'USD');
      expect(price1.equals(price2)).toBe(false);
    });

    it('should return false for different currencies', () => {
      const price1 = new Price(100, 'USD');
      const price2 = new Price(100, 'EUR');
      expect(price1.equals(price2)).toBe(false);
    });
  });

  describe('comparison methods', () => {
    it('should compare prices correctly', () => {
      const price1 = new Price(100, 'USD');
      const price2 = new Price(200, 'USD');

      expect(price2.isGreaterThan(price1)).toBe(true);
      expect(price1.isLessThan(price2)).toBe(true);
      expect(price1.isGreaterThan(price2)).toBe(false);
    });

    it('should throw error when comparing different currencies', () => {
      const priceUSD = new Price(100, 'USD');
      const priceEUR = new Price(100, 'EUR');

      expect(() => priceUSD.isGreaterThan(priceEUR)).toThrow(InvalidPriceException);
    });
  });

  describe('arithmetic operations', () => {
    it('should add prices correctly', () => {
      const price1 = new Price(100, 'USD');
      const price2 = new Price(50, 'USD');
      const result = price1.add(price2);

      expect(result.amount).toBe(150);
      expect(result.currency).toBe('USD');
    });

    it('should subtract prices correctly', () => {
      const price1 = new Price(100, 'USD');
      const price2 = new Price(30, 'USD');
      const result = price1.subtract(price2);

      expect(result.amount).toBe(70);
      expect(result.currency).toBe('USD');
    });

    it('should multiply price correctly', () => {
      const price = new Price(100, 'USD');
      const result = price.multiply(2);

      expect(result.amount).toBe(200);
      expect(result.currency).toBe('USD');
    });

    it('should throw error when adding different currencies', () => {
      const priceUSD = new Price(100, 'USD');
      const priceEUR = new Price(50, 'EUR');

      expect(() => priceUSD.add(priceEUR)).toThrow(InvalidPriceException);
    });

    it('should throw error for invalid multiplication factor', () => {
      const price = new Price(100, 'USD');

      expect(() => price.multiply(-1)).toThrow(InvalidPriceException);
      expect(() => price.multiply(NaN)).toThrow(InvalidPriceException);
    });
  });

  describe('toString and toJSON', () => {
    it('should convert to string correctly', () => {
      const price = new Price(100.50, 'USD');
      expect(price.toString()).toBe('USD 100.50');
    });

    it('should convert to JSON correctly', () => {
      const price = new Price(100.50, 'USD');
      const json = price.toJSON();

      expect(json).toEqual({
        amount: 100.50,
        currency: 'USD'
      });
    });
  });

  describe('fromString', () => {
    it('should parse valid price string', () => {
      const price = Price.fromString('USD 100.50');
      expect(price.amount).toBe(100.50);
      expect(price.currency).toBe('USD');
    });

    it('should throw error for invalid format', () => {
      expect(() => Price.fromString('invalid')).toThrow();
      expect(() => Price.fromString('USD')).toThrow();
      expect(() => Price.fromString('100.50')).toThrow();
    });

    it('should throw error for invalid amount', () => {
      expect(() => Price.fromString('USD invalid')).toThrow();
    });
  });

  describe('getSupportedCurrencies', () => {
    it('should return array of supported currencies', () => {
      const currencies = Price.getSupportedCurrencies();
      expect(Array.isArray(currencies)).toBe(true);
      expect(currencies).toContain('USD');
      expect(currencies).toContain('EUR');
      expect(currencies.length).toBeGreaterThan(0);
    });
  });
});
