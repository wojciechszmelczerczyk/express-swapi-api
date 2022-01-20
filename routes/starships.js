const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("all starships");
});

router.get("/:id", (req, res) => {
  res.send("one starship");
});

module.exports = router;
