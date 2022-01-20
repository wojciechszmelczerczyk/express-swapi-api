require("dotenv").config();

// user model
const User = require("../model/User");

const maxAge = process.env.JWT_EXPIRATION;

// add user to database
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    res.json(user);
    return user;
  } catch (err) {
    res.json(err);
    return err;
  }
};
