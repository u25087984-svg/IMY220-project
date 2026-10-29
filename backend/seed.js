import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./db.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Album from "./models/Album.js";
import Activity from "./models/Activity.js";
import ReportReason from "./models/ReportReason.js";

const reasons = [
  { id: 1, label: "Spam", description: "Repetitive or irrelevant content" },
  { id: 2, label: "Inappropriate", description: "Offensive or NSFW" },
  { id: 3, label: "Harassment", description: "Targets an individual" },
  { id: 4, label: "Misinformation", description: "False or misleading" },
];

const users = [
  {
    id: 1, username: "@test", email: "test@test.com", password: "test1234",
    name: "Test User", pronouns: "they/them", role: "user",
    bio: "I am the demo account.", profilePic: "/images/robot.jpg",
    posts: [1], friends: [2, 3], friendRequests: [], sentRequests: [6],
    socialLinks: { instagram: "@test", twitter: "", website: "" },
  },
  {
    id: 2, username: "@sarah", email: "sarah@test.com", password: "pass123",
    name: "Sarah Mokoena", pronouns: "she/her", role: "user",
    bio: "React enthusiast. Coffee-powered.", profilePic: "/images/robot.jpg",
    posts: [2, 3], friends: [1, 3, 4], friendRequests: [], sentRequests: [],
    socialLinks: { instagram: "@sarah", twitter: "@sarah_tw", website: "" },
  },
  {
    id: 3, username: "@john", email: "john@test.com", password: "pass123",
    name: "John Dlamini", pronouns: "he/him", role: "user",
    bio: "Practical survivor.", profilePic: "/images/robot.jpg",
    posts: [4, 5], friends: [1, 2], friendRequests: [6], sentRequests: [],
    socialLinks: { instagram: "", twitter: "", website: "https://john.dev" },
  },
  {
    id: 4, username: "@leanne", email: "leanne@test.com", password: "pass123",
    name: "Leanne Adams", pronouns: "she/her", role: "user",
    bio: "Sunsets and rivers.", profilePic: "/images/robot.jpg",
    posts: [6, 7], friends: [2], friendRequests: [], sentRequests: [],
    socialLinks: { instagram: "@leanne_a", twitter: "", website: "" },
  },
  {
    id: 5, username: "@mike", email: "mike@test.com", password: "pass123",
    name: "Mike Nkosi", pronouns: "he/him", role: "user",
    bio: "Street photography.", profilePic: "/images/robot.jpg",
    posts: [8], friends: [], friendRequests: [], sentRequests: [2],
    socialLinks: { instagram: "@mikeshots", twitter: "", website: "" },
  },
  {
    id: 6, username: "@emma", email: "emma@test.com", password: "pass123",
    name: "Emma Pillay", pronouns: "she/her", role: "user",
    bio: "Film photography only.", profilePic: "/images/robot.jpg",
    posts: [9], friends: [], friendRequests: [], sentRequests: [3],
    socialLinks: { instagram: "@emmafilm", twitter: "", website: "" },
  },
  {
    id: 7, username: "@david", email: "david@test.com", password: "pass123",
    name: "David Botha", pronouns: "he/him", role: "user",
    bio: "Landscapes.", profilePic: "/images/robot.jpg",
    posts: [10], friends: [], friendRequests: [], sentRequests: [],
    socialLinks: { instagram: "", twitter: "@dbotha", website: "" },
  },
  {
    id: 8, username: "@admin", email: "admin@test.com", password: "admin1234",
    name: "Site Admin", pronouns: "", role: "admin",
    bio: "I keep things tidy.", profilePic: "/images/robot.jpg",
    posts: [], friends: [], friendRequests: [], sentRequests: [],
    socialLinks: { instagram: "", twitter: "", website: "" },
  },
];

const posts = [
  { id: 1, username: "@test", caption: "Hello world from the test account!",
    image: "/images/robot.jpg", hashtags: ["#hello", "#test"],
    comments: [{ id: 1, commUname: "@sarah", comment: "Welcome!" }] },
  { id: 2, username: "@sarah", caption: "Studying React today!",
    image: "/images/robot.jpg", hashtags: ["#react", "#study"],
    comments: [{ id: 2, commUname: "@john", comment: "Nice!" }] },
  { id: 3, username: "@sarah", caption: "My new coffee setup.",
    image: "/images/robot.jpg", hashtags: ["#coffee", "#setup"], comments: [] },
  { id: 4, username: "@john", caption: "Finished Practical 4 finally.",
    image: "/images/robot.jpg", hashtags: ["#prac4", "#survived"],
    comments: [{ id: 3, commUname: "@leanne", comment: "Grats!" }] },
  { id: 5, username: "@john", caption: "Weekend hike.",
    image: "/images/robot.jpg", hashtags: ["#hike", "#nature"], comments: [] },
  { id: 6, username: "@leanne", caption: "Sunset over campus.",
    image: "/images/robot.jpg", hashtags: ["#sunset", "#campus"], comments: [] },
  { id: 7, username: "@leanne", caption: "My favourite river.",
    image: "/images/robot.jpg", hashtags: ["#river", "#nature"], comments: [] },
  { id: 8, username: "@mike", caption: "Street photography in the city.",
    image: "/images/robot.jpg", hashtags: ["#street", "#city"], comments: [] },
  { id: 9, username: "@emma", caption: "Shot on 35mm film.",
    image: "/images/robot.jpg", hashtags: ["#film", "#35mm"], comments: [] },
  { id: 10, username: "@david", caption: "Mountain landscape at dawn.",
    image: "/images/robot.jpg", hashtags: ["#landscape", "#mountains"], comments: [] },
];

const albums = [
  { id: 1, username: "@test", name: "My First Album",
    description: "Just starting out.", hashtags: ["#start"], posts: [1] },
  { id: 2, username: "@sarah", name: "Summer 2026",
    description: "Best of summer.", hashtags: ["#summer"], posts: [2, 3] },
  { id: 3, username: "@john", name: "Practical Pics",
    description: "IMY 220 work.", hashtags: ["#prac"], posts: [4] },
  { id: 4, username: "@leanne", name: "Nature Walk",
    description: "Rivers and sunsets.", hashtags: ["#nature"], posts: [6, 7] },
  { id: 5, username: "@mike", name: "City Series",
    description: "Urban shots.", hashtags: ["#city"], posts: [8] },
];

const activities = [
  { id: 1, username: "@test", type: "post_created", targetType: "post", targetId: 1 },
  { id: 2, username: "@test", type: "album_created", targetType: "album", targetId: 1,
    metadata: { name: "My First Album" } },
  { id: 3, username: "@sarah", type: "post_created", targetType: "post", targetId: 2 },
  { id: 4, username: "@sarah", type: "album_created", targetType: "album", targetId: 2,
    metadata: { name: "Summer 2026" } },
  { id: 5, username: "@sarah", type: "photos_added", targetType: "album", targetId: 2,
    metadata: { count: 2 } },
  { id: 6, username: "@john", type: "post_created", targetType: "post", targetId: 4 },
  { id: 7, username: "@john", type: "album_created", targetType: "album", targetId: 3,
    metadata: { name: "Practical Pics" } },
  { id: 8, username: "@leanne", type: "post_created", targetType: "post", targetId: 6 },
  { id: 9, username: "@leanne", type: "album_created", targetType: "album", targetId: 4,
    metadata: { name: "Nature Walk" } },
  { id: 10, username: "@mike", type: "album_created", targetType: "album", targetId: 5,
    metadata: { name: "City Series" } },
];

async function seed() {
  await connectDB();

  await User.deleteMany({});
  await Post.deleteMany({});
  await Album.deleteMany({});
  await Activity.deleteMany({});
  await ReportReason.deleteMany({});

  await User.insertMany(users);
  await Post.insertMany(posts);
  await Album.insertMany(albums);
  await Activity.insertMany(activities);
  await ReportReason.insertMany(reasons);

  console.log(`Seeded ${users.length} users, ${posts.length} posts, ${albums.length} albums`);
  console.log("Test login: test@test.com / test1234");
  console.log("Admin login: admin@test.com / admin1234");

  await mongoose.connection.close();
}

seed().catch((e) => { console.error(e); process.exit(1); });