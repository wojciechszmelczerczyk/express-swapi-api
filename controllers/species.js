const e = require("express");
const swapi = require("swapi-node");
const getAll = require("../api/getAll");

const getAllSpecies = async (req, res) => {
  if (req.query.page !== undefined) {
    const paginateSpecies = await swapi.get(
      `https://swapi.dev/api/species?page=${req.query.page}`
    );
    res.json(paginateSpecies);
    return paginateSpecies;
  } else {
    const allSpecies = await getAll("https://swapi.dev/api/species");
    res.json(allSpecies);
    return allSpecies;
  }
};

const getSpecies = async (req, res) => {
  const id = req.params.id;
  const singleSpecies = await swapi.species({ id });
  res.json(singleSpecies);
  return singleSpecies;
};

module.exports = {
  getAllSpecies,
  getSpecies,
};
