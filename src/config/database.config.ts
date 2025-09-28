import { registerAs } from "@nestjs/config";

/**
 * Database Configuration
 * Configures MongoDB connection settings
 */
export default registerAs("database", () => ({
  uri: process.env.MONGODB_URI || "mongodb://localhost:27017/icliniq-shopify",
  database: process.env.MONGODB_DATABASE || "icliniq-shopify",
}));
