export const CHAIN_IDS = {
  sepolia: 11_155_111,
} as const;

export const NETWORK_NAMES: Record<number, string> = {
  [CHAIN_IDS.sepolia]: "sepolia",
};

export const MULTICALL3_ADDRESS =
  "0xcA11bde05977b3631167028862bE2a173976CA11" as const;

export const DEFAULT_POLL_INTERVAL_MS = 60_000;
export const DEFAULT_BATCH_SIZE = 50;
