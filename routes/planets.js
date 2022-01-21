const express = require("express");

const router = express.Router();

// cache
const cache = require("../cache/routeCache");

// use cache for all routes
router.use(cache(86400));

// controller
const { getAllPlanets, getPlanet } = require("../controllers/planets");

router.get("/", getAllPlanets);

router.get("/:id", getPlanet);

module.exports = router;
