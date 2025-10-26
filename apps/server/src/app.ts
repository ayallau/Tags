import express, { type RequestHandler } from "express";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import passport from "./services/passport.js";
import authRoutes from "./routes/auth.routes.js";
import config from "./config.js";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import https from "node:https";
import fs from "node:fs";
import { readFileSync } from "node:fs";

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read version from package.json
let APP_VERSION: string;
try {
  const packageJson = JSON.parse(
    readFileSync(path.join(__dirname, "..", "package.json"), "utf-8")
  );
  APP_VERSION = packageJson.version || "unknown";
} catch {
  APP_VERSION = "unknown";
}

try {
  await mongoose.connect(config.MONGO_URI);
  console.log("MongoDB connected");
} catch (err) {
  console.error("MongoDB connection error:", err);
  process.exit(1);
}

const app = express();

// CORS Configuration
const corsOptions: CorsOptions = {
  origin: config.CLIENT_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Basic route to test server
const rootHandler: RequestHandler = (_req, res): void => {
  res.send(
    "Welcome to the server!<br>" +
      'OpenAPI: <a href="/openapi.yaml" target="_blank">openapi.yaml</a> | ' +
      'Swagger UI: <a href="/docs" target="_blank">docs</a>' +
      '<br>For authentication, use the <a href="/auth/google" target="_blank">/auth/google</a> endpoint.'
  );
};
app.get("/", rootHandler);

// Health endpoint
const healthHandler: RequestHandler = (_req, res): void => {
  res.json({
    ok: true,
    ts: new Date().toISOString(),
    mode: process.env.NODE_ENV || "development",
  });
};
app.get("/health", healthHandler);

// Version endpoint
const versionHandler: RequestHandler = (_req, res): void => {
  res.json({
    version: APP_VERSION,
  });
};
app.get("/version", versionHandler);

app.use("/auth", authRoutes);

// Example protected route
import { requireAuth } from "./middleware/requireAuth.js";

const meHandler: RequestHandler = (req, res): void => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({
    userId: req.user._id,
    email: req.user.emailLower,
    roles: req.user.roles,
  });
};
app.get("/api/me", requireAuth, meHandler);

// Swagger UI setup
const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  const openapiHandler: RequestHandler = (_req, res): void => {
    res.sendFile(path.join(__dirname, "..", "docs", "openapi.yaml"));
  };
  app.get("/openapi.yaml", openapiHandler);

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, { swaggerUrl: "/openapi.yaml", explorer: true })
  );
}

// Start the server
let server: any;

if (config.SSL_ENABLED) {
  try {
    const options = {
      key: fs.readFileSync(config.SSL_KEY_PATH),
      cert: fs.readFileSync(config.SSL_CERT_PATH),
    };

    server = https.createServer(options, app).listen(config.PORT, (): void => {
      console.log(
        `🚀 Server is running on HTTPS: https://localhost:${config.PORT}`
      );
      console.log(`📱 Client URL: ${config.CLIENT_URL}`);
      if (isDev) {
        console.log("📚 OpenAPI: /openapi.yaml | Swagger UI: /docs");
      }
    });
  } catch (error) {
    console.error("❌ Failed to start HTTPS server:", error);
    console.log("💡 Make sure SSL certificates exist in apps/server/certs/");
    console.log("💡 Or run with HTTP: pnpm dev:http");
    process.exit(1);
  }
} else {
  server = app.listen(config.PORT, (): void => {
    console.log(
      `🚀 Server is running on HTTP: http://localhost:${config.PORT}`
    );
    console.log(`📱 Client URL: ${config.CLIENT_URL}`);
    if (isDev) {
      console.log("📚 OpenAPI: /openapi.yaml | Swagger UI: /docs");
    }
  });
}

export default server;
