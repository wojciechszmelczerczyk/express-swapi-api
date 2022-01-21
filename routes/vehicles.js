const express = require("express");

const router = express.Router();

// cache
const cache = require("../cache/routeCache");

// use cache for all routes
router.use(cache(86400));

// controller
const { getAllVehicles, getVehicle } = require("../controllers/vehicles");

router.get("/", getAllVehicles);

router.get("/:id", getVehicle);

module.exports = router;
