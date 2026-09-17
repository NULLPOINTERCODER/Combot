import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import changelogRoutes from "./routes/changelog.routes.js";
import adminChangelogRoutes from "./routes/adminChangelog.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true, // required for httpOnly cookies cross-origin
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ and . from req.body/query/params - NoSQL injection protection
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "..", env.UPLOAD_DIR)));

app.get("/health", (req, res) => res.json({ success: true, message: "OK" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/changelog", changelogRoutes);
app.use("/api/v1/admin/changelogs", adminChangelogRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/uploads", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
