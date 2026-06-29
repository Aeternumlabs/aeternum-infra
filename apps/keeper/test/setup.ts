import { afterEach, vi } from "vitest";

/**
 * Global test setup — runs before every test file.
 * Clears all mock call counts and return values between tests so state
 * from one test never bleeds into another.
 */
afterEach(() => {
  vi.clearAllMocks();
});