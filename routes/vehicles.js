const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("all vehicles");
});

router.get("/:id", (req, res) => {
  res.send("one vehicle");
});

module.exports = router;
