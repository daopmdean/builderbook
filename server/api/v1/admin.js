const express = require("express");
const router = express.Router();

const Book = require("../../models/Book");
const User = require("../../models/User");
const { getRepos } = require("../../github");

router.use((req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).json({ error: "unauthoried admin access" });
    return;
  }

  next();
});

router.get("/books", async (req, res) => {
  try {
    const books = await Book.list();
    res.json(books);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.post("/books/add", async (req, res) => {
  try {
    const book = await Book.add(req.body);
    res.json(book);
  } catch (err) {
    console.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

router.post("/books/edit", async (req, res) => {
  try {
    const editedBook = await Book.edit(req.body);
    res.json(editedBook);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.get("/books/detail/:slug", async (req, res) => {
  try {
    const book = await Book.getBySlug({ slug: req.params.slug });
    res.json(book);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.get("/github/repos", async (req, res) => {
  const user = await User.findById(
    req.user._id,
    "isGithubConnected githubAccessToken"
  );

  if (!user.isGithubConnected || !user.githubAccessToken) {
    res.json({ error: "Github not connected" });
    return;
  }

  try {
    const response = await getRepos({ user, request: req });
    res.json({ repos: response.data });
  } catch (err) {
    console.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

router.post("/books/sync-content", async (req, res) => {
  const { bookId } = req.body;

  const user = await User.findById(
    req.user._id,
    "isGithubConnected githubAccessToken"
  );

  if (!user.isGithubConnected || !user.githubAccessToken) {
    res.json({ error: "Github not connected" });
    return;
  }

  try {
    await Book.syncContent({ id: bookId, user, request: req });
    res.json({ done: 1 });
  } catch (err) {
    console.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
