const express = require("express");

const router = express.Router();

// controller
const { getAllPlanets, getPlanet } = require("../controllers/planets");

router.get("/", getAllPlanets);

router.get("/:id", getPlanet);

module.exports = router;
