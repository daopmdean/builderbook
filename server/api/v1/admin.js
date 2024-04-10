const express = require("express");
const router = express.Router();

const Book = require("../../models/Book");

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

module.exports = router;
