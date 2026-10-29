import express from "express";
import User from "../models/User.js";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email, password required" });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ error: "Email already registered" });
    }
    if (await User.findOne({ username })) {
      return res.status(409).json({ error: "Username taken" });
    }
    const last = await User.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;
    const user = await User.create({
      id: nextId, username, email, password, name: name || username,
      posts: [], friends: [], friendRequests: [], sentRequests: [],
    });
    req.session.user = {
      id: user.id, username: user.username, email: user.email, role: user.role,
    };
    const { password: _p, ...safe } = user.toObject();
    res.status(201).json({ success: true, user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.user = {
      id: user.id, username: user.username, email: user.email, role: user.role,
    };
    const { password: _p, ...safe } = user.toObject();
    res.json({ success: true, user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", requireLogin, async (req, res) => {
  const user = await User.findOne({ id: req.session.user.id }).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

export default router;