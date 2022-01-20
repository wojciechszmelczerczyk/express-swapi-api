const swapi = require("swapi-node");

const getAll = async (url) => {
  try {
    let results = [];
    let response = await swapi.get(url);

    const items = response.count;
    const elementsPerPage = response.results.length;

    const numberOfPages = Math.floor(
      (items + elementsPerPage - 1) / elementsPerPage
    );

    results = await Promise.all(
      Array.from(Array(numberOfPages), (_, i) =>
        swapi.get(`${url}?page=${i + 1}`)
      )
    );
    return results;
  } catch (err) {
    console.log(err);
  }
};

module.exports = getAll;
