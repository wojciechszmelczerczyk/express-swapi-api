const swapi = require("swapi-node");
const getAll = require("../api/getAll");

const getAllVehicles = async (req, res) => {
  if (req.query.page !== undefined) {
    const paginateVehicles = await swapi.get(
      `https://swapi.dev/api/vehicles?page=${req.query.page}`
    );
    res.json(paginateVehicles);
    return paginateVehicles;
  } else {
    const allVehicles = await getAll("https://swapi.dev/api/vehicles");
    res.json(allVehicles);
    return allVehicles;
  }
};

const getVehicle = async (req, res) => {
  const id = req.params.id;
  const vehicle = await swapi.vehicles({ id });
  res.json(vehicle);
  return vehicle;
};

module.exports = {
  getAllVehicles,
  getVehicle,
};
