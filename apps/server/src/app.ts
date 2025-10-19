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
      '<br>For authentication, use the <a href="/auth/google" target="_blank">/auth/google</a> endpoint.',
  );
};
app.get("/", rootHandler);

app.use("/auth", authRoutes);

// דוגמה לנתיב מוגן
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  const openapiHandler: RequestHandler = (_req, res): void => {
    res.sendFile(path.join(__dirname, "..", "docs", "openapi.yaml"));
  };
  app.get("/openapi.yaml", openapiHandler);

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, { swaggerUrl: "/openapi.yaml", explorer: true }),
  );
}

// Start the server
const server = app.listen(config.PORT, (): void => {
  console.log(`Server is running on URL http://localhost:${config.PORT}`);
  if (isDev) {
    console.log("➜ OpenAPI: /openapi.yaml | Swagger UI: /docs");
  }
});

export default server;
