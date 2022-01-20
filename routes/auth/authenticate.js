const express = require("express");

const router = express.Router();

// controller
const { auth } = require("../../controllers/auth");

router.post("/", auth);

module.exports = router;
