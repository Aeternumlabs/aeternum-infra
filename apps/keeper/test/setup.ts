/**
 * test/setup.ts
 *
 * Global test setup file — runs once before所有 test suites.
 *
 * PURPOSE:
 *   - Set up test environment variables required by @aeternum/config
 *   - Configure test-specific logging behavior
 *   - Initialize any global test fixtures
 */

import { beforeEach } from "vitest";

// Set up minimal environment variables for tests
// These are required by @aeternum/config's env validation
process.env.CHAIN_ID = "1";
process.env.RPC_URL = "https://eth-mainnet.g.alchemy.com/v2/test";
process.env.CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";

// Keeper-specific env variables
process.env.KEEPER_PRIVATE_KEY = "0x0000000000000000000000000000000000000000000000000000000000000001";

beforeEach(() => {
  // Reset any module-level state between tests
  // This is important because index.ts has a health server and polling loop
  // that could leak state across test files
  vi.clearAllMocks();
});
