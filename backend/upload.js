import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const UPLOAD_DIR = path.resolve("uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, crypto.randomBytes(16).toString("hex") + ext);
  },
});

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error("Only .jpg, .png, .gif, .webp allowed"));
    }
    cb(null, true);
  },
});

export { UPLOAD_DIR };