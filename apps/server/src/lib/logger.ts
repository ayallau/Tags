// apps/server/src/lib/logger.ts
import type { Request, Response } from "express";

export interface LogContext {
  [key: string]: unknown;
}

export interface Logger {
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext, err?: Error): void;
  debug(message: string, context?: LogContext): void;
  request(req: Request, res: Response, durationMs: number): void;
}

type LogLevel = "info" | "warn" | "error" | "debug";

const isDevelopment = process.env.NODE_ENV === "development";
const isDebugMode = process.env.DEBUG === "true";

const formatLog = (
  level: LogLevel,
  message: string,
  context?: LogContext,
  err?: Error
): string => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` | ${JSON.stringify(context)}` : "";
  const errorStr = err
    ? ` | Error: ${err.message}${err.stack ? `\n${err.stack}` : ""}`
    : "";

  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}${errorStr}`;
};

const logConsole = (
  level: LogLevel,
  message: string,
  context?: LogContext,
  err?: Error
): void => {
  const formatted = formatLog(level, message, context, err);

  switch (level) {
    case "error":
      console.error(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "debug":
      if (isDebugMode || isDevelopment) {
        console.debug(formatted);
      }
      break;
    case "info":
    default:
      console.log(formatted);
      break;
  }
};

export const logger: Logger = {
  info: (message: string, context?: LogContext): void => {
    logConsole("info", message, context);
  },

  warn: (message: string, context?: LogContext): void => {
    logConsole("warn", message, context);
  },

  error: (message: string, context?: LogContext, err?: Error): void => {
    logConsole("error", message, context, err);
  },

  debug: (message: string, context?: LogContext): void => {
    logConsole("debug", message, context);
  },

  request: (req: Request, res: Response, durationMs: number): void => {
    if (!isDevelopment) return;

    const status = res.statusCode;
    const statusColor =
      status >= 500
        ? "\x1b[31m"
        : status >= 400
          ? "\x1b[33m"
          : status >= 300
            ? "\x1b[36m"
            : "\x1b[32m";
    const resetColor = "\x1b[0m";

    console.log(
      `${req.method} ${req.originalUrl} ${statusColor}${status}${resetColor} ${durationMs.toFixed(2)}ms`
    );
  },
};

export default logger;
