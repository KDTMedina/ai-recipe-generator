require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const recipeRoutes = require("./routes/recipes");
const aiRoutes = require("./routes/ai");
const favoritesRoutes = require("./routes/favorites");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "10kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── Rate Limiting ──────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", apiLimiter);

// Stricter limiter for AI endpoints (they cost money)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: "AI generation limit reached. Try again in an hour." },
});
app.use("/api/ai/", aiLimiter);

// ─── Routes ─────────────────────────────────────────────────────────
app.use("/api/recipes", recipeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/favorites", favoritesRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

// ─── Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🍳 Recipe API running on http://localhost:${PORT}`);
});
