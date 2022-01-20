const express = require("express");
const app = express();

// routes
const films = require("./routes/films");
const people = require("./routes/people");
const planets = require("./routes/planets");
const species = require("./routes/species");
const starships = require("./routes/starships");
const vehicles = require("./routes/vehicles");

app.use("/films", films);
app.use("/people", people);
app.use("/planets", planets);
app.use("/species", species);
app.use("/starships", starships);
app.use("/vehicles", vehicles);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is listening...");
});
