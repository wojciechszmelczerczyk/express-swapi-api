const swapi = require("swapi-node");
const getAll = require("../api/getAll");

const getAllFilms = async (req, res) => {
  const films = await getAll("https://swapi.dev/api/films");

  res.json(films);
  return films;
};

const getFilmsStats = async (req, res) => {
  const [people, films] = await Promise.all([
    getAll("https://swapi.dev/api/people"),
    swapi.films({}),
  ]);

  const opening_crawls = films.results
    .map((film) => {
      return film["opening_crawl"];
    })
    .join("");

  const words = opening_crawls.match(/[\w\d\'\'-]+/gi);

  const uniqueValues = words.reduce(
    (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
    new Map()
  );

  const list = [...uniqueValues].map((value) => {
    return value;
  });

  // return character names
  const characterFullNames = people.map((page, i) => {
    return page.results.map((result) => result.name);
  });

  const characterNames = [].concat(...characterFullNames).map((character) => {
    return character.replace(new RegExp("\\s+\\w+"), "");
  });

  let bestCandidateName = null;
  let bestCandidateOccurences = 0;
  const cleanedOpeningCrawls = words.join("");

  characterNames.forEach((name) => {
    const count = (cleanedOpeningCrawls.match(new RegExp(name, "g")) || [])
      .length;
    if (count > bestCandidateOccurences) {
      bestCandidateName = name;
      bestCandidateOccurences = count;
    }
  });

  const result = {
    words: list,
    mostPopularCharacter: {
      name: bestCandidateName,
      occurences: bestCandidateOccurences,
    },
  };
  res.json(result);
  return result;
};

const getFilm = async (req, res) => {
  const id = req.params.id;
  const film = await swapi.films({ id });
  res.json(film);
  return film;
};

module.exports = {
  getAllFilms,
  getFilmsStats,
  getFilm,
};
