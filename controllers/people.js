const swapi = require("swapi-node");

const getAll = require("../api/getAll");

const getAllPeople = async (req, res) => {
  if (req.query.page !== undefined) {
    const paginatedCharacters = await swapi.get(
      `https://swapi.dev/api/people?page=${req.query.page}`
    );
    res.json(paginatedCharacters);
    return paginatedCharacters;
  } else {
    const allPeople = await getAll("https://swapi.dev/api/people");
    res.json(allPeople);
    return allPeople;
  }
};

const getPerson = async (req, res) => {
  const id = req.params.id;
  const person = await swapi.people({ id });
  res.json(person);
  return person;
};

module.exports = {
  getAllPeople,
  getPerson,
};
