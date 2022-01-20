const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("all people");
});

router.get("/:id", (req, res) => {
  res.send("one person");
});

module.exports = router;
