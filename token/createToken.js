const jwt = require("jsonwebtoken");

const maxAge = process.env.JWT_EXPIRATION;

require("dotenv").config();

const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIN: maxAge,
    }
  );
};
