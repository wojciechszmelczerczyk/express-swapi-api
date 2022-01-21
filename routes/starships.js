const express = require("express");

const router = express.Router();

// cache
const cache = require("../cache/routeCache");

// use cache for all routes
router.use(cache(86400));

// controller
const { getAllStarships, getStarship } = require("../controllers/starships");

router.get("/", getAllStarships);

router.get("/:id", getStarship);

module.exports = router;
