
import express from "express";
import Album from "../models/Album.js";

const router = express.Router();

// GET all albums
router.get("/", async (_req, res) => {
  const albums = await Album.find().sort({ createdAt: -1 });
  res.json(albums);
});

// GET one album
router.get("/:id", async (req, res) => {
  const album = await Album.findOne({ id: Number(req.params.id) });
  if (!album) return res.status(404).json({ error: "Album not found" });
  res.json(album);
});

// CREATE album
router.post("/", async (req, res) => {
  try {
    const { username, name, description, hashtags, posts } = req.body;
    if (!username || !name) return res.status(400).json({ error: "username and name required" });

    const last = await Album.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;

    const album = await Album.create({
      id: nextId,
      username,
      name,
      description: description || "",
      hashtags: hashtags || [],
      posts: posts || [],
    });
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EDIT album
router.put("/:id", async (req, res) => {
  const { name, description, hashtags } = req.body;
  const album = await Album.findOneAndUpdate(
    { id: Number(req.params.id) },
    { $set: { name, description, hashtags } },
    { new: true }
  );
  if (!album) return res.status(404).json({ error: "Album not found" });
  res.json(album);
});

// ADD a post to album
router.post("/:id/posts/:postId", async (req, res) => {
  const album = await Album.findOneAndUpdate(
    { id: Number(req.params.id) },
    { $addToSet: { posts: Number(req.params.postId) } },
    { new: true }
  );
  if (!album) return res.status(404).json({ error: "Album not found" });
  res.json(album);
});

// REMOVE a post from album
router.delete("/:id/posts/:postId", async (req, res) => {
  const album = await Album.findOneAndUpdate(
    { id: Number(req.params.id) },
    { $pull: { posts: Number(req.params.postId) } },
    { new: true }
  );
  if (!album) return res.status(404).json({ error: "Album not found" });
  res.json(album);
});

// DELETE album
router.delete("/:id", async (req, res) => {
  const deleted = await Album.findOneAndDelete({ id: Number(req.params.id) });
  if (!deleted) return res.status(404).json({ error: "Album not found" });
  res.json({ success: true, deleted });
});

export default router;