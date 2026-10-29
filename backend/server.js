import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import path from "path";
import MongoStore from "connect-mongo";
import connectDB from "./db.js";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import albumRoutes from "./routes/albums.js";
import reportRoutes from "./routes/reports.js";
import activityRoutes from "./routes/activity.js";
import adminRoutes from "./routes/admin.js";
import searchRoutes from "./routes/search.js";
import uploadRoutes from "./routes/uploads.js";
import { UPLOAD_DIR } from "./upload.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: "imy220",
      collectionName: "sessions",
      ttl: 60 * 60 * 24,
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get("/", (_req, res) => res.json({ message: "Momentum backend running" }));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "1d" }));

app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 3001;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`API on ${PORT}`)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });