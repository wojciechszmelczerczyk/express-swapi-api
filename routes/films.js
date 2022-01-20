const express = require("express");

const router = express.Router();

// controller
const { getAllFilms, getFilmsStats, getFilm } = require("../controllers/films");

router.get("/", getAllFilms);

router.get("/stats", getFilmsStats);

router.get("/:id", getFilm);

module.exports = router;
