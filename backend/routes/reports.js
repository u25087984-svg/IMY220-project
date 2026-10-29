import express from "express";
import Post from "../models/Post.js";
import ReportReason from "../models/ReportReason.js";
import { requireLogin, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// public: list report reasons
router.get("/reasons", async (_req, res) => {
  const reasons = await ReportReason.find().sort({ id: 1 });
  res.json(reasons);
});

// admin: add a new reason
router.post("/reasons", requireAdmin, async (req, res) => {
  const { label, description } = req.body;
  if (!label) return res.status(400).json({ error: "label required" });
  const last = await ReportReason.findOne().sort({ id: -1 });
  const id = last ? last.id + 1 : 1;
  const reason = await ReportReason.create({ id, label, description: description || "" });
  res.status(201).json(reason);
});

// admin: delete a reason
router.delete("/reasons/:id", requireAdmin, async (req, res) => {
  await ReportReason.deleteOne({ id: Number(req.params.id) });
  res.json({ success: true });
});

// user: report a post
router.post("/post/:postId", requireLogin, async (req, res) => {
  const { reasonId } = req.body;
  const post = await Post.findOne({ id: Number(req.params.postId) });
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (post.username === req.session.user.username) {
    return res.status(400).json({ error: "Cannot report your own post" });
  }
  if (post.reports.some((r) => r.reporter === req.session.user.username)) {
    return res.status(409).json({ error: "You already reported this post" });
  }
  const reason = await ReportReason.findOne({ id: Number(reasonId) });
  if (!reason) return res.status(404).json({ error: "Reason not found" });
  post.reports.push({
    reporter: req.session.user.username,
    reasonId: reason.id,
    reason: reason.label,
    date: new Date(),
  });
  await post.save();
  res.status(201).json({ success: true, reportCount: post.reports.length });
});

// admin: list all reported posts
router.get("/admin/reported", requireAdmin, async (_req, res) => {
  const posts = await Post.find({ "reports.0": { $exists: true } }).sort({ updatedAt: -1 });
  res.json(posts);
});

// admin: clear all reports on a post
router.delete("/post/:postId/clear", requireAdmin, async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { id: Number(req.params.postId) },
    { $set: { reports: [] } },
    { new: true }
  );
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

export default router;