const swapi = require("swapi-node");
const getAll = require("../api/getAll");

const getAllPlanets = async (req, res) => {
  if (req.query.page !== undefined) {
    const paginatedPlanets = await swapi.get(
      `https://swapi.dev/api/planets?page=${req.query.page}`
    );

    res.json(paginatedPlanets);
    return paginatedPlanets;
  } else {
    const allPlanets = await getAll("https://swapi.dev/api/planets");
    res.json(allPlanets);
    return allPlanets;
  }
};

const getPlanet = async (req, res) => {
  const id = req.params.id;
  const planet = await swapi.planets({ id });
  res.json(planet);
  return planet;
};

module.exports = {
  getAllPlanets,
  getPlanet,
};
