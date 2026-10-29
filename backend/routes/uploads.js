import express from "express";
import { upload } from "../upload.js";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireLogin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

export default router;