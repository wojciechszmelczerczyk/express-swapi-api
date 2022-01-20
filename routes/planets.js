const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("all planets");
});

router.get("/:id", (req, res) => {
  res.send("one planet");
});

module.exports = router;
