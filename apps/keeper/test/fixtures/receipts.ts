/**
 * test/fixtures/receipts.ts
 *
 * Transaction receipt fixtures and the createReceipt() builder used
 * by executor tests and integration tests.
 *
 * The `logs` field is intentionally kept as an empty array in all
 * pre-built fixtures. executor.ts passes receipt.logs directly to
 * viem's parseEventLogs(), which is always mocked in unit tests —
 * so the actual log objects inside the receipt never matter. Tests
 * that need specific event outcomes configure the parseEventLogs mock
 * directly using fixtures from event-logs.ts.
 */

// --- Types ---

export type TestReceipt = {
  blockNumber:     bigint;
  gasUsed:         bigint;
  logs:            unknown[];
  transactionHash: `0x${string}`;
  status:          "success" | "reverted";
};

// --- Constants ---

export const TX_HASH_1 = `0x${"a".repeat(64)}` as `0x${string}`;
export const TX_HASH_2 = `0x${"b".repeat(64)}` as `0x${string}`;

// --- Builder ---

/**
 * Creates a transaction receipt with sensible defaults.
 * Pass overrides for any field that needs a specific value in a test.
 *
 * @example
 *   createReceipt({ gasUsed: 200_000n })
 *   createReceipt({ status: "reverted" })
 *   createReceipt({ transactionHash: TX_HASH_2 })
 */
export function createReceipt(overrides?: Partial<TestReceipt>): TestReceipt {
  return {
    blockNumber:     100n,
    gasUsed:         91_000n, // matches measured triggerRecovery gas cost
    logs:            [],
    transactionHash: TX_HASH_1,
    status:          "success",
    ...overrides,
  };
}

// --- Pre-built fixtures ---

/** Default receipt — no events, 91k gas, successful */
export const emptyReceipt = createReceipt();

/** Higher gas for a batch with multiple successful recoveries */
export const batchReceipt = createReceipt({
  gasUsed: 364_000n, // 4 × 91k
});

/** Receipt for the second transaction in a two-batch execution */
export const secondBatchReceipt = createReceipt({
  blockNumber:     101n,
  transactionHash: TX_HASH_2,
  gasUsed:         91_000n,
});