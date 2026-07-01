/**
 * src/executor.ts
 *
 * Submits triggerRecovery for a list of confirmed due wallets using
 * Multicall3's aggregate3 with allowFailure: true.
 *
 * WHY MULTICALL3:
 *   Batching multiple triggerRecovery calls into a single transaction
 *   saves the 21,000 gas base cost per tx. More importantly, allowFailure:
 *   true means a single vault's ETH transfer failure (e.g. a backup address
 *   that rejects ETH) does not revert the entire batch. Each wallet is
 *   handled independently — the same isolation guarantee the contract
 *   provides through _executeRecovery's silent-return design.
 *
 * TX_BATCH_SIZE:
 *   Capped at 20 wallets per transaction. At ~91k gas per recovery
 *   (measured), 20 × 91k = ~1.8M gas per tx — well within the 30M
 *   block gas limit. Adjust if gas conditions change.
 *
 * NONCE SAFETY:
 *   Batches are submitted sequentially — each awaits a receipt before
 *   the next is submitted. This keeps nonce ordering simple and avoids
 *   replacement-transaction edge cases.
 */

import { encodeFunctionData, parseEventLogs } from "viem";
import {
  AETERNUM_VAULT_ABI,
  MULTICALL3_ABI,
  MULTICALL3_ADDRESS,
  type ViemPublicClient,
  type ViemWalletClient,
} from "@aeternum/blockchain";
import { logger } from "./logger.js";
import type { Address } from "./scanner.js";

const TX_BATCH_SIZE = 20;

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Executes recovery for a confirmed list of due wallet addresses.
 *
 * Wallets are split into batches of TX_BATCH_SIZE and submitted via
 * Multicall3.aggregate3. RecoveryExecuted, RecoveryFailed, and
 * RecoveryAbandoned events are parsed from each receipt and logged
 * individually so the outcome of every wallet is observable.
 *
 * @param walletClient    Signing client for transaction submission.
 * @param publicClient    Read client for receipt retrieval.
 * @param contractAddress AeternumVault contract address.
 * @param wallets         Onchain-confirmed due wallet addresses from scanner.
 */
export async function execute(
  walletClient: ViemWalletClient,
  publicClient: ViemPublicClient,
  contractAddress: Address,
  wallets: Address[],
): Promise<void> {
  if (wallets.length === 0) return;

  const batches = chunk(wallets, TX_BATCH_SIZE);

  logger.info("Executor: beginning execution", {
    totalWallets: wallets.length,
    totalBatches: batches.length,
  });

  for (const [batchIndex, batch] of batches.entries()) {
    const batchNum = batchIndex + 1;

    logger.info("Executor: submitting batch", {
      batch: batchNum,
      of: batches.length,
      wallets: batch.length,
    });

    const calls = batch.map((wallet) => ({
      target: contractAddress,
      allowFailure: true as const,
      callData: encodeFunctionData({
        abi: AETERNUM_VAULT_ABI,
        functionName: "triggerRecovery",
        args: [wallet],
      }),
    }));

    try {
      // 1. Estimate the total gas needed for the Multicall transaction.
      // During simulation, the node grants plenty of gas so the inner execution succeeds.
      const estimatedGas = await publicClient.estimateContractGas({
        address: MULTICALL3_ADDRESS,
        abi: MULTICALL3_ABI,
        functionName: "aggregate3",
        args: [calls],
        account: walletClient.account,
      });

      // 2. Add a 30% buffer to override EIP-150 (63/64ths rule) overhead during sub-calls
      const gasWithBuffer = (estimatedGas * 130n) / 100n;

      // 3. Submit transaction with the safe, padded gas limit
      const hash = await walletClient.writeContract({
        address: MULTICALL3_ADDRESS,
        abi: MULTICALL3_ABI,
        functionName: "aggregate3",
        args: [calls],
        gas: gasWithBuffer,
      });

      logger.info("Executor: transaction submitted", { hash, batch: batchNum });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // RecoveryExecuted — ETH transfer to backup address succeeded.
      const executedLogs = parseEventLogs({
        abi: AETERNUM_VAULT_ABI,
        eventName: "RecoveryExecuted",
        logs: receipt.logs,
      });

      // RecoveryFailed — backup address rejected ETH. State restored,
      // failedRecoveryAttempts incremented. Keeper will retry next cycle.
      const failedLogs = parseEventLogs({
        abi: AETERNUM_VAULT_ABI,
        eventName: "RecoveryFailed",
        logs: receipt.logs,
      });

      // RecoveryAbandoned — MAX_RECOVERY_ATTEMPTS exhausted.
      // Balance preserved in vault; re-registration with new backup required.
      const abandonedLogs = parseEventLogs({
        abi: AETERNUM_VAULT_ABI,
        eventName: "RecoveryAbandoned",
        logs: receipt.logs,
      });

      logger.info("Executor: batch confirmed", {
        hash,
        block: receipt.blockNumber.toString(),
        gasUsed: receipt.gasUsed.toString(),
        recovered: executedLogs.length,
        failed: failedLogs.length,
        abandoned: abandonedLogs.length,
        submitted: batch.length,
      });

      for (const log of executedLogs) {
        logger.info("Recovery executed", {
          wallet: log.args.wallet,
          backupAddress: log.args.backupAddress,
          amount: log.args.amount?.toString(),
        });
      }

      for (const log of failedLogs) {
        logger.warn("Recovery failed — will retry next cycle", {
          wallet: log.args.wallet,
          backupAddress: log.args.backupAddress,
          amount: log.args.amount?.toString(),
        });
      }

      for (const log of abandonedLogs) {
        logger.warn("Recovery abandoned — MAX_RECOVERY_ATTEMPTS exhausted", {
          wallet: log.args.wallet,
          backupAddress: log.args.backupAddress,
          balance: log.args.balance?.toString(),
        });
      }
    } catch (err) {
      // Log and continue — a failed batch must not abort subsequent batches.
      logger.error("Executor: batch submission failed", {
        batch: batchNum,
        wallets: batch,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}