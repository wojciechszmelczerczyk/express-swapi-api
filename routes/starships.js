const express = require("express");

const router = express.Router();

// controller
const { getAllStarships, getStarship } = require("../controllers/starships");

router.get("/", getAllStarships);

router.get("/:id", getStarship);

module.exports = router;
