const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("all species");
});

router.get("/:id", (req, res) => {
  res.send("one species");
});

module.exports = router;
