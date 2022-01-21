const express = require("express");

const router = express.Router();

// cache
const cache = require("../cache/routeCache");

// use cache for all routes
router.use(cache(86400));

// controller
const { getAllSpecies, getSpecies } = require("../controllers/species");

router.get("/", getAllSpecies);

router.get("/:id", getSpecies);

module.exports = router;
