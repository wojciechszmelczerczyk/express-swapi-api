const express = require("express");
const app = express();

// db
const db = require("./db/connection");

// dotenv
require("dotenv").config();

// auth routes
const auth = require("./routes/auth/authenticate");
const register = require("./routes/auth/register");
const logout = require("./routes/auth/logout");

// routes
const films = require("./routes/films");
const people = require("./routes/people");
const planets = require("./routes/planets");
const species = require("./routes/species");
const starships = require("./routes/starships");
const vehicles = require("./routes/vehicles");

// cookie-parser
const cookieParser = require("cookie-parser");

// body-parser
const bodyParser = require("body-parser");

db(process.env.DB_URI);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/authenticate", auth);
app.use("/register", register);
app.use("/logout", logout);

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
