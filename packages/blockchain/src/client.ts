/**
 * src/client.ts
 *
 * Factory functions for viem clients used across the monorepo.
 *
 * Design: accepts configuration as parameters rather than importing from
 * @aeternum/config directly. Callers pass env values at the call site,
 * keeping this module independently testable and free of env-validation
 * side effects.
 *
 * Two clients are provided:
 *   createViemPublicClient  — read-only; used by the keeper scanner to call
 *                             getTriggerableVaultsBatch and isRecoveryDue.
 *   createViemWalletClient  — signing; used by the keeper executor to submit
 *                             triggerRecovery transactions via Multicall3.
 *
 * The indexer (Ponder) manages its own internal RPC connection and does not
 * use these clients.
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  type PublicClient,
  type WalletClient,
  type Chain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet, sepolia } from "viem/chains";
import { CHAIN_IDS } from "@aeternum/config";

// --- Internal helpers ---

/**
 * Maps a numeric chain ID to the corresponding viem Chain object.
 * Throws early with a clear message if the chain is not yet supported,
 * rather than failing silently downstream.
 */
function resolveChain(chainId: number): Chain {
  switch (chainId) {
    case CHAIN_IDS.MAINNET:
      return mainnet;
    case CHAIN_IDS.SEPOLIA:
      return sepolia;
    default:
      throw new Error(
        `Unsupported chainId: ${chainId}. ` +
        `Add it to resolveChain() in packages/blockchain/src/client.ts.`,
      );
  }
}

// --- Public clients ---

export type ViemPublicClient = PublicClient;
export type ViemWalletClient = WalletClient;

/**
 * Creates a read-only viem public client.
 * Use this for all contract reads: getTriggerableVaultsBatch, isRecoveryDue,
 * getTotalRegistered, and getRecoveryConfig.
 *
 * @param rpcUrl   HTTP(S) RPC endpoint (env.RPC_URL).
 * @param chainId  Numeric EVM chain ID (env.CHAIN_ID).
 */
export function createViemPublicClient(
  rpcUrl: string,
  chainId: number,
): ViemPublicClient {
  return createPublicClient({
    chain: resolveChain(chainId),
    transport: http(rpcUrl, {
      // Retry on transient RPC failures before propagating the error.
      retryCount: 3,
      retryDelay: 1_000,
    }),
  });
}

/**
 * Creates a signing viem wallet client for the keeper executor.
 * This client holds a funded private key and is the only client in the
 * monorepo that can submit transactions. It should be instantiated once
 * at keeper startup and reused for the process lifetime.
 *
 * @param rpcUrl      HTTP(S) RPC endpoint (env.RPC_URL).
 * @param chainId     Numeric EVM chain ID (env.CHAIN_ID).
 * @param privateKey  Keeper wallet private key (0x-prefixed).
 *                    Read from KEEPER_PRIVATE_KEY in apps/keeper/.env.
 *                    Never stored in the root .env or any shared config.
 */
export function createViemWalletClient(
  rpcUrl: string,
  chainId: number,
  privateKey: `0x${string}`,
): ViemWalletClient {
  const account = privateKeyToAccount(privateKey);

  return createWalletClient({
    account,
    chain: resolveChain(chainId),
    transport: http(rpcUrl, {
      retryCount: 3,
      retryDelay: 1_000,
    }),
  });
}