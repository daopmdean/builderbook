const express = require("express");
const router = express.Router();
const Chapter = require("../../models/Chapter");

router.get("/get-chapter-detail", async (req, res) => {
  try {
    const { bookSlug, chapterSlug } = req.query;
    const chapter = await Chapter.getBySlug({
      bookSlug,
      chapterSlug,
      userId: req.user && req.user.id,
      isAdmin: req.user && req.user.isAdmin,
    });
    res.json(chapter);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
