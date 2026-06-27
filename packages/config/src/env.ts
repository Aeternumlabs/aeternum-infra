/**
 * src/env.ts
 *
 * Validates all shared environment variables at startup using zod.
 * Both apps/indexer and apps/keeper import `env` from this module.
 *
 * Design: validation runs at module import time. If any required variable is
 * missing or malformed, the process exits immediately with a clear error
 * rather than failing silently at runtime.
 *
 * App-specific variables (e.g. KEEPER_PRIVATE_KEY) are validated in each
 * app's own env module, not here.
 */

import { z } from "zod";

const envSchema = z.object({
  // --- Network ---
  CHAIN_ID: z.coerce
    .number()
    .int()
    .positive("CHAIN_ID must be a positive integer"),

  RPC_URL: z.string().url("RPC_URL must be a valid URL"),

  // --- Contract ---
  CONTRACT_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "CONTRACT_ADDRESS must be a valid Ethereum address"),

  CONTRACT_DEPLOY_BLOCK: z.coerce
    .number()
    .int()
    .nonnegative("CONTRACT_DEPLOY_BLOCK must be a non-negative integer"),

  // --- Database ---
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection string"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌  Invalid environment variables:\n");
  const errors = parsed.error.flatten().fieldErrors;
  for (const [field, messages] of Object.entries(errors)) {
    console.error(`  ${field}: ${messages?.join(", ")}`);
  }
  console.error("\nCheck your .env file against .env.example and try again.");
  process.exit(1);
}

export const env = parsed.data;

export type Env = typeof env;