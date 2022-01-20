const express = require("express");

const router = express.Router();

// controller
const { getAllPeople, getPerson } = require("../controllers/people");

router.get("/", getAllPeople);

router.get("/:id", getPerson);

module.exports = router;
