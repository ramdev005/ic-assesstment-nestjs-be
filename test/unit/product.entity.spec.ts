import { Product } from "../../src/products/entities/product.entity";
import { Price, Quantity } from "../../src/shared/value-objects";

describe("Product Entity", () => {
  let product: Product;
  let price: Price;
  let stockQuantity: Quantity;

  beforeEach(() => {
    price = new Price(99.99, "USD");
    stockQuantity = new Quantity(100);
    product = Product.create(
      "Test Product",
      "TEST-SKU-001",
      price,
      stockQuantity,
      "Test description",
      "Test Category",
      ["https://example.com/image.jpg"],
      "Test Brand"
    );
  });

  describe("creation", () => {
    it("should create a product with all properties", () => {
      expect(product.name).toBe("Test Product");
      expect(product.sku).toBe("TEST-SKU-001");
      expect(product.price).toEqual(price);
      expect(product.stockQuantity).toEqual(stockQuantity);
      expect(product.description).toBe("Test description");
      expect(product.category).toBe("Test Category");
      expect(product.images).toEqual(["https://example.com/image.jpg"]);
      expect(product.brand).toBe("Test Brand");
      expect(product.isActive).toBe(true);
    });

    it("should create a product with minimal properties", () => {
      const minimalProduct = Product.create(
        "Minimal Product",
        "MIN-SKU-001",
        price,
        stockQuantity
      );

      expect(minimalProduct.name).toBe("Minimal Product");
      expect(minimalProduct.sku).toBe("MIN-SKU-001");
      expect(minimalProduct.description).toBeUndefined();
      expect(minimalProduct.category).toBeUndefined();
      expect(minimalProduct.images).toEqual([]);
      expect(minimalProduct.brand).toBeUndefined();
    });
  });

  describe("updateName", () => {
    it("should update product name", () => {
      product.updateName("Updated Product Name");
      expect(product.name).toBe("Updated Product Name");
    });

    it("should throw error for empty name", () => {
      expect(() => product.updateName("")).toThrow(
        "Product name cannot be empty"
      );
      expect(() => product.updateName("   ")).toThrow(
        "Product name cannot be empty"
      );
    });

    it("should trim whitespace from name", () => {
      product.updateName("  Trimmed Name  ");
      expect(product.name).toBe("Trimmed Name");
    });
  });

  describe("updateDescription", () => {
    it("should update product description", () => {
      product.updateDescription("Updated description");
      expect(product.description).toBe("Updated description");
    });

    it("should set description to undefined for empty string", () => {
      product.updateDescription("");
      expect(product.description).toBeUndefined();
    });

    it("should trim whitespace from description", () => {
      product.updateDescription("  Trimmed description  ");
      expect(product.description).toBe("Trimmed description");
    });
  });

  describe("updatePrice", () => {
    it("should update product price", () => {
      const newPrice = new Price(149.99, "USD");
      product.updatePrice(newPrice);
      expect(product.price).toEqual(newPrice);
    });
  });

  describe("updateStockQuantity", () => {
    it("should update stock quantity", () => {
      const newQuantity = new Quantity(200);
      product.updateStockQuantity(newQuantity);
      expect(product.stockQuantity).toEqual(newQuantity);
    });
  });

  describe("updateCategory", () => {
    it("should update product category", () => {
      product.updateCategory("Updated Category");
      expect(product.category).toBe("Updated Category");
    });

    it("should set category to undefined for empty string", () => {
      product.updateCategory("");
      expect(product.category).toBeUndefined();
    });
  });

  describe("updateImages", () => {
    it("should update product images", () => {
      const newImages = [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ];
      product.updateImages(newImages);
      expect(product.images).toEqual(newImages);
    });

    it("should set empty array for undefined images", () => {
      product.updateImages(undefined);
      expect(product.images).toEqual([]);
    });
  });

  describe("updateBrand", () => {
    it("should update product brand", () => {
      product.updateBrand("Updated Brand");
      expect(product.brand).toBe("Updated Brand");
    });

    it("should set brand to undefined for empty string", () => {
      product.updateBrand("");
      expect(product.brand).toBeUndefined();
    });
  });

  describe("activate", () => {
    it("should activate product", () => {
      // Set product as inactive first
      product["_isActive"] = false;
      expect(product.isActive).toBe(false);

      product.activate();
      expect(product.isActive).toBe(true);
    });
  });

  describe("stock management", () => {
    it("should check if product is in stock", () => {
      expect(product.isInStock()).toBe(true);

      product.updateStockQuantity(new Quantity(0));
      expect(product.isInStock()).toBe(false);
    });

    it("should check if stock can be reduced", () => {
      expect(product.canReduceStock(new Quantity(50))).toBe(true);
      expect(product.canReduceStock(new Quantity(100))).toBe(true);
      expect(product.canReduceStock(new Quantity(101))).toBe(false);
    });

    it("should reduce stock", () => {
      product.reduceStock(new Quantity(30));
      expect(product.stockQuantity.value).toBe(70);
    });

    it("should throw error when reducing stock below zero", () => {
      expect(() => product.reduceStock(new Quantity(101))).toThrow(
        "Insufficient stock"
      );
    });

    it("should add stock", () => {
      product.addStock(new Quantity(50));
      expect(product.stockQuantity.value).toBe(150);
    });
  });

  describe("equals", () => {
    it("should return true for same product", () => {
      const sameProduct = new Product(
        "Test Product",
        "TEST-SKU-001",
        price,
        stockQuantity,
        product.id
      );
      expect(product.equals(sameProduct)).toBe(true);
    });

    it("should return false for different products", () => {
      const differentProduct = Product.create(
        "Different Product",
        "DIFF-SKU-001",
        price,
        stockQuantity
      );
      expect(product.equals(differentProduct)).toBe(false);
    });
  });
});
