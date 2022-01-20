const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("all films");
});

router.get("/stats", (req, res) => {
  res.send("films stats");
});

router.get("/:id", (req, res) => {
  res.send("one film");
});

module.exports = router;
