/**
 * src/constants.ts
 *
 * Shared constants across all apps and packages.
 * These never change at runtime — anything that needs to vary by environment
 * belongs in env.ts instead.
 */

// --- Chain IDs ---
export const CHAIN_IDS = {
  MAINNET: 1,
  SEPOLIA: 11155111,
  ANVIL: 31337,
} as const;

export type ChainId = (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS];

export const NETWORK_NAMES: Record<number, string> = {
  [CHAIN_IDS.MAINNET]: "mainnet",
  [CHAIN_IDS.SEPOLIA]: "sepolia",
  [CHAIN_IDS.ANVIL]: "anvil",
};

// --- Keeper Defaults ---
/**
 * Default operational parameters for apps/keeper.
 * These can be overridden via the keeper's own app-level env vars.
 */
export const KEEPER_DEFAULTS = {
  /** How often the keeper polls for triggerable vaults (milliseconds). */
  POLL_INTERVAL_MS: 60_000,

  /**
   * Number of registry entries scanned per getTriggerableVaultsBatch call.
   * Keeper iterates through the full registry in pages of this size.
   */
  BATCH_SIZE: 1_000,
} as const;

// --- Protocol Constants ---
/**
 * Mirrors the MAX_RECOVERY_ATTEMPTS immutable in AeternumVault.sol.
 * Used for off-chain logic that reasons about the retry lifecycle.
 * If the contract value ever changes, update this to match.
 */
export const MAX_RECOVERY_ATTEMPTS = 3 as const;