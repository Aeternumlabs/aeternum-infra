/**
 * test/fixtures/event-logs.ts
 *
 * Minimal typed representations of the parsed event logs returned by
 * viem's parseEventLogs(). Only the fields our code actually reads are
 * included — executor.ts accesses log.args.* so that is the only
 * shape that needs to be accurate.
 *
 * Note: RecoveryAbandoned uses `balance`, not `amount`. This mirrors
 * the ABI definition exactly — using the wrong field name would cause
 * log.args.balance to be undefined in production.
 */

import { WALLET_A, WALLET_B, BACKUP_A, BACKUP_B, ONE_ETH } from "./vaults.js";

// --- Types ---

export type MockRecoveryExecutedLog = {
  eventName: "RecoveryExecuted";
  args: { wallet: `0x${string}`; backupAddress: `0x${string}`; amount: bigint };
};

export type MockRecoveryFailedLog = {
  eventName: "RecoveryFailed";
  args: { wallet: `0x${string}`; backupAddress: `0x${string}`; amount: bigint };
};

export type MockRecoveryAbandonedLog = {
  eventName: "RecoveryAbandoned";
  args: { wallet: `0x${string}`; backupAddress: `0x${string}`; balance: bigint };
};

// --- Individual log fixtures ---

export const executedLog: MockRecoveryExecutedLog = {
  eventName: "RecoveryExecuted",
  args: { wallet: WALLET_A, backupAddress: BACKUP_A, amount: ONE_ETH },
};

export const failedLog: MockRecoveryFailedLog = {
  eventName: "RecoveryFailed",
  args: { wallet: WALLET_B, backupAddress: BACKUP_B, amount: ONE_ETH },
};

export const abandonedLog: MockRecoveryAbandonedLog = {
  eventName: "RecoveryAbandoned",
  args: { wallet: WALLET_A, backupAddress: BACKUP_A, balance: ONE_ETH },
};

// --- Multi-event arrays ---

/** One of each event type — for testing that all three branches are covered */
export const oneOfEachLog = {
  executed: [executedLog],
  failed:   [failedLog],
  abandoned:[abandonedLog],
};

/**
 * Returns the correct fixture array for a given event name.
 * Mirrors the way parseEventLogs is called three times per batch in
 * executor.ts — use this inside a mockImplementation:
 *
 *   vi.mocked(parseEventLogs).mockImplementation(({ eventName }) =>
 *     eventLogsByName(eventName as string)
 *   );
 */
export function eventLogsByName(eventName: string): unknown[] {
  switch (eventName) {
    case "RecoveryExecuted": return [executedLog];
    case "RecoveryFailed":   return [failedLog];
    case "RecoveryAbandoned":return [abandonedLog];
    default:                 return [];
  }
}