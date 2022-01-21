const express = require("express");

const router = express.Router();

// cache
const cache = require("../cache/routeCache");

// use cache for all routes
router.use(cache(86400));

// controller
const { getAllFilms, getFilmsStats, getFilm } = require("../controllers/films");

router.get("/", getAllFilms);

router.get("/stats", getFilmsStats);

router.get("/:id", getFilm);

module.exports = router;
