import { registerAs } from "@nestjs/config";

/**
 * Application Configuration
 * Configures general application settings
 */
export default registerAs("app", () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: process.env.API_PREFIX || "api/v1",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:4321",
}));
