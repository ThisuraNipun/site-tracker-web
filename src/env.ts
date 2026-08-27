import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Type-safe, validated environment variables.
 * If any required variable is missing, the application will throw
 * a descriptive error at startup rather than silently failing at runtime.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_API_URL: z
      .string()
      .url("NEXT_PUBLIC_API_URL must be a valid URL")
      .default("http://localhost:5000"),
  },
  // Map process.env to the schema keys
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Skip validation in Docker/CI environments where env vars may not be set
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
