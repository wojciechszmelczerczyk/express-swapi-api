const express = require("express");

const router = express.Router();

// controller
const { getAllVehicles, getVehicle } = require("../controllers/vehicles");

router.get("/", getAllVehicles);

router.get("/:id", getVehicle);

module.exports = router;
