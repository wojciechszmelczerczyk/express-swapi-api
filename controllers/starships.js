const swapi = require("swapi-node");
const getAll = require("../api/getAll");

const getAllStarships = async (req, res) => {
  if (req.query.page !== undefined) {
    const paginatedStarships = await swapi.get(
      `https://swapi.dev/api/starships?page=${req.query.page}`
    );
    res.json(paginatedStarships);
    return paginatedStarships;
  } else {
    const allStarships = await getAll("https://swapi.dev/api/starships");
    res.json(allStarships);
    return allStarships;
  }
};

const getStarship = async (req, res) => {
  const id = req.params.id;
  const starship = await swapi.starships({ id });
  res.json(starship);
  return starship;
};

module.exports = {
  getAllStarships,
  getStarship,
};
