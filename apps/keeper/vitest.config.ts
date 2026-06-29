import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Global test setup file — runs once before all test suites
    setupFiles: ["./test/setup.ts"],

    // Separate unit and integration runs by glob so each can be
    // invoked independently: `pnpm test:unit` vs `pnpm test:integration`
    include: [
      "test/unit/**/*.test.ts",
      "test/integration/**/*.test.ts",
    ],

    // Isolate each test file in its own worker so module-level side
    // effects in index.ts (health server, polling loop) don't bleed
    // across test files.
    pool: "forks",

    // Node is the only relevant environment for a keeper bot.
    environment: "node",

    // Group output by test file for readability in CI logs.
    reporters: ["verbose"],

    // Coverage via V8 — no extra binary required.
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.d.ts"],
      reporter: ["text", "lcov"],
    },
  },
});