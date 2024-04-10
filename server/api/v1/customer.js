const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: "unauthoried access" });
    return;
  }

  next();
});

module.exports = router;
