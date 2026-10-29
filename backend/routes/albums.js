import express from "express";
import Album from "../models/Album.js";
import Post from "../models/Post.js";
import Activity from "../models/Activity.js";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

async function nextId(Model) {
  const last = await Model.findOne().sort({ id: -1 });
  return last ? last.id + 1 : 1;
}

router.get("/", async (_req, res) => {
  const albums = await Album.find().sort({ createdAt: -1 });
  res.json(albums);
});

router.get("/:id", async (req, res) => {
  const album = await Album.findOne({ id: Number(req.params.id) });
  if (!album) return res.status(404).json({ error: "Album not found" });
  const posts = await Post.find({ id: { $in: album.posts } });
  res.json({ ...album.toObject(), postsFull: posts });
});

router.post("/", requireLogin, async (req, res) => {
  const { name, description, hashtags, posts } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const id = await nextId(Album);
  const album = await Album.create({
    id, username: req.session.user.username, name,
    description: description || "", hashtags: hashtags || [], posts: posts || [],
  });
  await Post.updateMany({ id: { $in: posts || [] } }, { $addToSet: { albums: id } });
  await Activity.create({
    id: await nextId(Activity), username: req.session.user.username,
    type: "album_created", targetType: "album", targetId: id, metadata: { name },
  });
  res.status(201).json(album);
});

router.put("/:id", requireLogin, async (req, res) => {
  const album = await Album.findOne({ id: Number(req.params.id) });
  if (!album) return res.status(404).json({ error: "Album not found" });
  if (album.username !== req.session.user.username && req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Not allowed" });
  }
  const { name, description, hashtags } = req.body;
  if (name !== undefined) album.name = name;
  if (description !== undefined) album.description = description;
  if (hashtags !== undefined) album.hashtags = hashtags;
  await album.save();
  res.json(album);
});

router.post("/:id/posts/:postId", requireLogin, async (req, res) => {
  const album = await Album.findOne({ id: Number(req.params.id) });
  if (!album) return res.status(404).json({ error: "Album not found" });
  if (album.username !== req.session.user.username) {
    return res.status(403).json({ error: "Not allowed" });
  }
  const postId = Number(req.params.postId);
  if (!album.posts.includes(postId)) {
    album.posts.push(postId);
    await album.save();
    await Post.updateOne({ id: postId }, { $addToSet: { albums: album.id } });
    await Activity.create({
      id: await nextId(Activity), username: album.username,
      type: "photos_added", targetType: "album", targetId: album.id,
      metadata: { count: 1, name: album.name },
    });
  }
  res.json(album);
});

router.delete("/:id/posts/:postId", requireLogin, async (req, res) => {
  const album = await Album.findOne({ id: Number(req.params.id) });
  if (!album) return res.status(404).json({ error: "Album not found" });
  if (album.username !== req.session.user.username) {
    return res.status(403).json({ error: "Not allowed" });
  }
  const postId = Number(req.params.postId);
  album.posts = album.posts.filter((id) => id !== postId);
  await album.save();
  await Post.updateOne({ id: postId }, { $pull: { albums: album.id } });
  res.json(album);
});

router.delete("/:id", requireLogin, async (req, res) => {
  const album = await Album.findOne({ id: Number(req.params.id) });
  if (!album) return res.status(404).json({ error: "Album not found" });
  if (album.username !== req.session.user.username && req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Not allowed" });
  }
  await Post.updateMany({ albums: album.id }, { $pull: { albums: album.id } });
  await Album.deleteOne({ id: album.id });
  res.json({ success: true });
});

export default router;