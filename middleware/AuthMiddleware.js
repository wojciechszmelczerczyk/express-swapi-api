const jwt = require("jsonwebtoken");

// dotenv
require("dotenv").config();

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.send("jwt is invalid");
      } else {
        next();
      }
    });
  } else {
    res.send("jwt doesn't exists");
  }
};

module.exports = {
  requireAuth,
};
