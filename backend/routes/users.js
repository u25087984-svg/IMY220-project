import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Album from "../models/Album.js";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.get("/:username", async (req, res) => {
  const target = await User.findOne({ username: req.params.username }).select("-password");
  if (!target) return res.status(404).json({ error: "User not found" });

  const viewer = req.session?.user;
  const isSelf = viewer?.username === target.username;
  const isAdmin = viewer?.role === "admin";

  let viewerDoc = null;
  if (viewer) viewerDoc = await User.findOne({ id: viewer.id });

  const isFriend = viewerDoc?.friends.includes(target.id) ?? false;

  let friendshipStatus = "none";
  if (isSelf) friendshipStatus = "self";
  else if (isFriend) friendshipStatus = "friends";
  else if (viewerDoc) {
    if (viewerDoc.friendRequests.includes(target.id)) friendshipStatus = "incoming";
    else if (viewerDoc.sentRequests.includes(target.id)) friendshipStatus = "outgoing";
  }

  const albums = await Album.find({ username: target.username });

  // hydrate friend ids -> user summaries
  const friendsFull = await User.find(
    { id: { $in: target.friends } },
    { _id: 0, id: 1, username: 1, name: 1, profilePic: 1 }
  );

  // hydrate incoming requests -> user summaries (only shown to self anyway)
  const friendRequestsFull = await User.find(
    { id: { $in: target.friendRequests } },
    { _id: 0, id: 1, username: 1, name: 1, profilePic: 1 }
  );

  const base = {
    ...target.toObject(),
    friendshipStatus,
    albums,
    friendsFull,
    friendRequestsFull,
  };

  

  if (isSelf || isFriend || isAdmin) {
    return res.json(base);
  }
  
  return res.json({
    id: target.id,
    username: target.username,
    name: target.name,
    profilePic: target.profilePic,
    friendshipStatus,
    albums: [],
    friendsFull: [],
    friendRequestsFull: [],
  });
});

router.put("/:username", requireLogin, async (req, res) => {
  if (req.session.user.username !== req.params.username && req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Not allowed" });
  }
  const { name, pronouns, bio, profilePic, socialLinks } = req.body;
  const update = {};
  ["name", "pronouns", "bio", "profilePic", "socialLinks"].forEach((k) => {
    if (req.body[k] !== undefined) update[k] = req.body[k];
  });
  const updated = await User.findOneAndUpdate(
    { username: req.params.username },
    { $set: update },
    { new: true }
  ).select("-password");
  res.json(updated);
});

router.delete("/:username", requireLogin, async (req, res) => {
  if (req.session.user.username !== req.params.username && req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Not allowed" });
  }
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ error: "User not found" });

  // cascade
  await Post.deleteMany({ username: user.username });
  await Album.deleteMany({ username: user.username });
  await User.updateMany(
    {},
    { $pull: { friends: user.id, friendRequests: user.id, sentRequests: user.id } }
  );
  await User.deleteOne({ id: user.id });
  req.session.destroy(() => {});
  res.json({ success: true });
});

router.post("/:to/friend-request", requireLogin, async (req, res) => {
  const from = await User.findOne({ username: req.session.user.username });
  const to = await User.findOne({ username: req.params.to });
  if (!to) return res.status(404).json({ error: "Target not found" });
  if (from.id === to.id) return res.status(400).json({ error: "Cannot friend yourself" });
  if (to.friends.includes(from.id)) return res.status(409).json({ error: "Already friends" });
  if (to.friendRequests.includes(from.id))
    return res.status(409).json({ error: "Already requested" });

  to.friendRequests.push(from.id);
  from.sentRequests.push(to.id);
  await to.save();
  await from.save();
  res.json({ success: true });
});

router.post("/:requesterUsername/accept", requireLogin, async (req, res) => {
  const me = await User.findOne({ username: req.session.user.username });
  const requester = await User.findOne({ username: req.params.requesterUsername });
  if (!requester) return res.status(404).json({ error: "Requester not found" });
  if (!me.friendRequests.includes(requester.id)) {
    return res.status(404).json({ error: "No pending request" });
  }
  me.friendRequests = me.friendRequests.filter((id) => id !== requester.id);
  if (!me.friends.includes(requester.id)) me.friends.push(requester.id);
  requester.sentRequests = requester.sentRequests.filter((id) => id !== me.id);
  if (!requester.friends.includes(me.id)) requester.friends.push(me.id);
  await me.save();
  await requester.save();
  res.json({ success: true });
});

router.post("/:requesterUsername/decline", requireLogin, async (req, res) => {
  const me = await User.findOne({ username: req.session.user.username });
  const requester = await User.findOne({ username: req.params.requesterUsername });
  if (!requester) return res.status(404).json({ error: "Requester not found" });
  me.friendRequests = me.friendRequests.filter((id) => id !== requester.id);
  requester.sentRequests = requester.sentRequests.filter((id) => id !== me.id);
  await me.save();
  await requester.save();
  res.json({ success: true });
});

router.post("/:friendUsername/unfriend", requireLogin, async (req, res) => {
  const me = await User.findOne({ username: req.session.user.username });
  const friend = await User.findOne({ username: req.params.friendUsername });
  if (!friend) return res.status(404).json({ error: "Friend not found" });
  me.friends = me.friends.filter((id) => id !== friend.id);
  friend.friends = friend.friends.filter((id) => id !== me.id);
  await me.save();
  await friend.save();
  res.json({ success: true });
});

export default router;