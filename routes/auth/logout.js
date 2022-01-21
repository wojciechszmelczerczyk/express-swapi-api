const express = require("express");

const router = express.Router();

// controller
const { logout } = require("../../controllers/auth");

router.get("/", logout);

module.exports = router;
