import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "../../src/logger.js";

describe("logger", () => {
  let stdoutSpy: ReturnType<typeof vi.spyOn>;
  let stderrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    stdoutSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    stderrSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- Output routing ---

  describe("output routing", () => {
    it("info writes to stdout only", () => {
      logger.info("test");
      expect(stdoutSpy).toHaveBeenCalledOnce();
      expect(stderrSpy).not.toHaveBeenCalled();
    });

    it("debug writes to stdout only", () => {
      logger.debug("test");
      expect(stdoutSpy).toHaveBeenCalledOnce();
      expect(stderrSpy).not.toHaveBeenCalled();
    });

    it("warn writes to stderr only", () => {
      logger.warn("test");
      expect(stderrSpy).toHaveBeenCalledOnce();
      expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it("error writes to stderr only", () => {
      logger.error("test");
      expect(stderrSpy).toHaveBeenCalledOnce();
      expect(stdoutSpy).not.toHaveBeenCalled();
    });
  });

  // --- JSON structure ---

  describe("JSON structure", () => {
    it("produces a single valid JSON line", () => {
      logger.info("test");
      const output = stdoutSpy.mock.calls[0][0] as string;
      expect(() => JSON.parse(output)).not.toThrow();
    });

    it("includes a ts field matching ISO 8601 format", () => {
      logger.info("test");
      const { ts } = JSON.parse(stdoutSpy.mock.calls[0][0]);
      expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("ts is a valid date", () => {
      logger.info("test");
      const { ts } = JSON.parse(stdoutSpy.mock.calls[0][0]);
      expect(Number.isNaN(Date.parse(ts))).toBe(false);
    });

    it("includes the correct level field", () => {
      logger.warn("test");
      const { level } = JSON.parse(stderrSpy.mock.calls[0][0]);
      expect(level).toBe("warn");
    });

    it("includes the msg field matching the message argument", () => {
      logger.info("hello keeper");
      const { msg } = JSON.parse(stdoutSpy.mock.calls[0][0]);
      expect(msg).toBe("hello keeper");
    });

    it("spreads additional data fields into the root object", () => {
      logger.info("test", { wallet: "0xabc", count: 3 });
      const output = JSON.parse(stdoutSpy.mock.calls[0][0]);
      expect(output.wallet).toBe("0xabc");
      expect(output.count).toBe(3);
    });

    it("does not nest extra data under a data key", () => {
      logger.info("test", { wallet: "0xabc" });
      const output = JSON.parse(stdoutSpy.mock.calls[0][0]);
      expect(output.data).toBeUndefined();
    });

    it("core fields (ts, level, msg) are always present with no extra data", () => {
      logger.debug("bare message");
      const output = JSON.parse(stdoutSpy.mock.calls[0][0]);
      expect(output).toHaveProperty("ts");
      expect(output).toHaveProperty("level");
      expect(output).toHaveProperty("msg");
    });
  });

  // --- All four levels round-trip ---

  describe("level field round-trip", () => {
    it.each([
      ["info",  "info",  "stdout"],
      ["debug", "debug", "stdout"],
      ["warn",  "warn",  "stderr"],
      ["error", "error", "stderr"],
    ] as const)("%s sets level=%s and writes to %s", (method, expected, destination) => {
      logger[method]("test");
      const spy = destination === "stdout" ? stdoutSpy : stderrSpy;
      const { level } = JSON.parse(spy.mock.calls[0][0]);
      expect(level).toBe(expected);
    });
  });
});