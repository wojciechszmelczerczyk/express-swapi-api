require("dotenv").config();

// user model
const User = require("../model/User");

const maxAge = process.env.JWT_EXPIRATION;

// create token function
const createToken = require("../token/createToken");

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

// authorize user, return jwt
const auth = async (req, res) => {
  const { email, body } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      expiresIn: maxAge * 1000,
    });
    res.json({ token });
  } catch (err) {
    res.json({ error: err.message });
    return err;
  }
};

module.exports = {
  register,
  auth,
};
