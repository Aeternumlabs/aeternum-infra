import {
  createPublicClientForRpc,
  createWalletClientForRpc,
} from "@aeternum/blockchain";
import { keeperEnvSchema, parseEnv } from "@aeternum/config";

import { executeRecoveries } from "./executor";
import { logger } from "./logger";
import { scanTriggerableVaults } from "./scanner";

const env = parseEnv(keeperEnvSchema);

const publicClient = createPublicClientForRpc(env.DRPC_URL);
const walletClient = createWalletClientForRpc(
  env.DRPC_URL,
  env.KEEPER_PRIVATE_KEY as `0x${string}`,
);

async function runCycle() {
  logger.info("Starting keeper scan cycle");

  const triggerable = await scanTriggerableVaults(
    publicClient,
    env.BATCH_SIZE,
  );

  if (triggerable.length === 0) {
    logger.info("No triggerable vaults found");
    return;
  }

  logger.info("Found triggerable vaults", { count: triggerable.length });
  await executeRecoveries(walletClient, triggerable);
}

async function main() {
  logger.info("Aeternum keeper started", {
    pollIntervalMs: env.POLL_INTERVAL_MS,
    batchSize: env.BATCH_SIZE,
  });

  await runCycle();

  setInterval(() => {
    runCycle().catch((error: unknown) => {
      logger.error("Keeper cycle failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    });
  }, env.POLL_INTERVAL_MS);
}

main().catch((error: unknown) => {
  logger.error("Keeper failed to start", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
