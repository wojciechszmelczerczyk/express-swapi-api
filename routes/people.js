const express = require("express");

const router = express.Router();

// cache
const cache = require("../cache/routeCache");

// use cache for all routes
router.use(cache(86400));

// controller
const { getAllPeople, getPerson } = require("../controllers/people");

router.get("/", getAllPeople);

router.get("/:id", getPerson);

module.exports = router;
