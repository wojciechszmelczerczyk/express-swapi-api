// express app
const app = require("../index");

// supertest
const request = require("supertest");

// jwt
let jwt = process.env.JWT;

describe("Get films", () => {
  test("Get all films", async () => {
    const films = await request(app).get("/films").set("Cookie", `jwt=${jwt}`);
    const numberOfMovies = films.body[0].results.length;
    expect(numberOfMovies).toBe(6);
  });
  test("Get films stats", async () => {
    const filmsStats = await request(app)
      .get("/films/stats")
      .set("Cookie", `jwt=${jwt};`);

    const mostPopularCharacterName = filmsStats.body.mostPopularCharacter.name;
    const wordsOccurences = filmsStats.body.words;

    expect(mostPopularCharacterName).toBe("Luke");
    expect(wordsOccurences).not.toBe(null);
  });
  test("Get film with id 1", async () => {
    const filmId = 1;
    const filmWithId1 = await request(app)
      .get(`/films/${filmId}`)
      .set("Cookie", `jwt=${jwt};`);
    const titleOfFilmWithId1 = filmWithId1.body.title;
    expect(titleOfFilmWithId1).toBe("A New Hope");
  });
});

describe("Get people", () => {
  test("Get people across all pages", async () => {
    const allPeople = await request(app)
      .get("/people")
      .set("Cookie", `jwt=${jwt};`);
    const numberOfPages = allPeople.body.length;

    expect(numberOfPages).toBe(9);
  });

  test("Get people from page 1", async () => {
    const page = 1;

    const charactersFromPage1 = await request(app)
      .get("/people")
      .query({ page })
      .set("Cookie", `jwt=${jwt};`);

    const previousPage = charactersFromPage1.body.previous;

    expect(previousPage).toBe(null);
  });
  test("Get person with id 1", async () => {
    const characterId = 1;

    const characterWithId1 = await request(app)
      .get(`/people/${characterId}`)
      .set("Cookie", `jwt=${jwt};`);
    const fullNameOfCharacterWithId1 = characterWithId1.body.name;
    expect(fullNameOfCharacterWithId1).toBe("Luke Skywalker");
  });
});

describe("Get planets", () => {
  test("Get all planets", async () => {
    const allPlanets = await request(app)
      .get("/planets")
      .set("Cookie", `jwt=${jwt};`);
    const numberOfPagesOfPlanets = await allPlanets.body.length;
    expect(numberOfPagesOfPlanets).toBe(6);
  });

  test("Get page of planets", async () => {
    const page = 1;
    const planetsFromPage1 = await request(app)
      .get("/planets")
      .query({ page })
      .set("Cookie", `jwt=${jwt};`);
    const previousPage = planetsFromPage1.body.previous;
    expect(previousPage).toBe(null);
  });

  test("Get planet with id 1", async () => {
    const planetId = 1;
    const planetWithId1 = await request(app)
      .get(`/planets/${planetId}`)
      .set("Cookie", `jwt=${jwt};`);
    const planetName = planetWithId1.body.name;
    expect(planetName).toBe("Tatooine");
  });
});

describe("Get species", () => {
  test("Get all species", async () => {
    const allSpecies = await request(app)
      .get("/species")
      .set("Cookie", `jwt=${jwt};`);

    const numberOfPagesOfSpecies = allSpecies.body.length;

    expect(numberOfPagesOfSpecies).toBe(4);
  });

  test("Get page of species", async () => {
    const page = 1;
    const speciesFromPage1 = await request(app)
      .get("/species")
      .query({ page })
      .set("Cookie", `jwt=${jwt};`);

    const nameOfFirstSpeciesFromPage1 = speciesFromPage1.body.results[0].name;
    expect(nameOfFirstSpeciesFromPage1).toBe("Human");
  });

  test("Get species with id 1", async () => {
    const speciesId = 1;

    const speciesWithId1 = await request(app)
      .get(`/species/${speciesId}`)
      .set("Cookie", `jwt=${jwt};`);
    const nameOfSpeciesWithId1 = speciesWithId1.body.name;
    expect(nameOfSpeciesWithId1).toBe("Human");
  });
});

describe("Get starships", () => {
  test("Get starships across all pages", async () => {
    const allStarships = await request(app)
      .get("/starships")
      .set("Cookie", `jwt=${jwt};`);

    const numberOfPagesOfStarships = allStarships.body.length;
    expect(numberOfPagesOfStarships).toBe(4);
  });

  test("Get page of starships", async () => {
    const page = 1;
    const starshipsFromPage1 = await request(app)
      .get("/starships")
      .query({ page })
      .set("Cookie", `jwt=${jwt};`);

    const nameOfFirstStarshipFromPage1 =
      starshipsFromPage1.body.results[0].name;

    expect(nameOfFirstStarshipFromPage1).toBe("CR90 corvette");
  });

  test("Get starship with id 2", async () => {
    const starshipId = 2;
    const starshipWithId2 = await request(app)
      .get(`/starships/${starshipId}`)
      .set("Cookie", `jwt=${jwt};`);

    const nameOfStarshipWithId2 = starshipWithId2.body.name;
    expect(nameOfStarshipWithId2).toBe("CR90 corvette");
  });
});

describe("Get vehicles", () => {
  test("Get vehicles across all pages", async () => {
    const allVehicles = await request(app)
      .get("/vehicles")
      .set("Cookie", `jwt=${jwt};`);

    const numberOfPagesOfVehicles = allVehicles.body.length;
    expect(numberOfPagesOfVehicles).toBe(4);
  });

  test("Get page of vehicles", async () => {
    const page = 2;
    const vehiclesFromPage2 = await request(app)
      .get("/vehicles")
      .query({ page })
      .set("Cookie", `jwt=${jwt};`);

    const nameOfFirstVehicleFromPage2 = vehiclesFromPage2.body.results[0].name;

    expect(nameOfFirstVehicleFromPage2).toBe("Bantha-II cargo skiff");
  });

  test("Get vehicle with id 4", async () => {
    const vehicleId = 4;
    const vehicleWithId4 = await request(app)
      .get(`/vehicles/${vehicleId}`)
      .set("Cookie", `jwt=${jwt};`);

    const nameOfVehicleWithId4 = vehicleWithId4.body.name;
    expect(nameOfVehicleWithId4).toBe("Sand Crawler");
  });
});
