/**
 * src/logger.ts
 *
 * Lightweight structured JSON logger. No external dependencies.
 * Each log line is a single JSON object suitable for Railway's log
 * aggregation and any downstream log processing tooling.
 *
 * Output shape:
 *   { "ts": "2026-01-01T00:00:00.000Z", "level": "info", "msg": "...", ...data }
 */

type LogLevel = "debug" | "info" | "warn" | "error";

type LogData = Record<string, unknown>;

function write(level: LogLevel, msg: string, data?: LogData): void {
  const entry: Record<string, unknown> = {
    ts: new Date().toISOString(),
    level,
    msg,
    ...data,
  };

  const line = JSON.stringify(entry);

  if (level === "error" || level === "warn") {
    console.error(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (msg: string, data?: LogData) => write("debug", msg, data),
  info:  (msg: string, data?: LogData) => write("info",  msg, data),
  warn:  (msg: string, data?: LogData) => write("warn",  msg, data),
  error: (msg: string, data?: LogData) => write("error", msg, data),
};