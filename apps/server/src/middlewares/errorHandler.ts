// apps/server/src/middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from "express";
import logger from "../lib/logger.js";

export interface ApiError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

// Generate a simple request ID (UUID-like without external deps)
const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Extract or generate request ID
const getRequestId = (req: Request): string => {
  return (
    (req as Request & { requestId?: string }).requestId || generateRequestId()
  );
};

// Error handler middleware
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
): void => {
  const requestId = getRequestId(req);

  // Log the error
  const errorMessage = err instanceof Error ? err.message : "Unknown error";
  logger.error(
    `Error on ${req.method} ${req.originalUrl}`,
    {
      requestId,
      error: errorMessage,
    },
    err instanceof Error ? err : undefined
  );

  // Default error
  const defaultError: ErrorResponse = {
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
      requestId,
    },
  };

  // Handle known error types
  if (err instanceof Error) {
    // Validation errors (e.g., from express-validator or custom validators)
    if (err.name === "ValidationError" || err.message.includes("validation")) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data",
          details: err.message,
          requestId,
        },
      });
      return;
    }

    // Authentication errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      res.status(401).json({
        error: {
          code: "AUTH_ERROR",
          message: "Authentication failed",
          details: err.message,
          requestId,
        },
      });
      return;
    }

    // Authorization errors
    if (
      err.name === "UnauthorizedError" ||
      err.message.includes("Unauthorized")
    ) {
      res.status(403).json({
        error: {
          code: "AUTHORIZATION_ERROR",
          message: "Access denied",
          details: err.message,
          requestId,
        },
      });
      return;
    }

    // Not found errors
    if (err.message.includes("not found") || err.name === "NotFoundError") {
      res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Resource not found",
          details: err.message,
          requestId,
        },
      });
      return;
    }

    // Custom API errors
    if ("statusCode" in err && typeof err.statusCode === "number") {
      res.status(err.statusCode).json({
        error: {
          code: (err as ApiError).code || "API_ERROR",
          message: err.message || "API error",
          details: (err as ApiError).details,
          requestId,
        },
      });
      return;
    }
  }

  // Default 500 error
  res.status(500).json(defaultError);
};

// 404 handler middleware
export const notFoundHandler = (
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
): void => {
  const requestId = generateRequestId();

  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, {
    requestId,
  });

  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
      details: `${req.method} ${req.originalUrl}`,
      requestId,
    },
  });
};
