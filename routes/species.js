const express = require("express");

const router = express.Router();

// controller
const { getAllSpecies, getSpecies } = require("../controllers/species");

router.get("/", getAllSpecies);

router.get("/:id", getSpecies);

module.exports = router;
