import { z } from "zod";

const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Expected a checksummed or lowercase address");

const privateKeySchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/, "Expected a 32-byte hex private key");

export const sharedEnvSchema = z.object({
  DRPC_URL: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_VAULT_ADDRESS: addressSchema,
});

export const keeperEnvSchema = sharedEnvSchema.extend({
  KEEPER_PRIVATE_KEY: privateKeySchema,
  POLL_INTERVAL_MS: z.coerce.number().int().positive().default(60_000),
  BATCH_SIZE: z.coerce.number().int().positive().default(50),
});

export function parseEnv<T extends z.ZodTypeAny>(
  schema: T,
  env: Record<string, string | undefined> = process.env,
): z.infer<T> {
  const result = schema.safeParse(env);
  if (!result.success) {
    throw new Error(
      `Invalid environment configuration:\n${result.error.toString()}`,
    );
  }
  return result.data;
}
