const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const maxAge = 1000 * 60 * 60 * 24;

const handleError = (err) => {
  let errors = { name: "", email: "", password: "" };

  // Validation Errors
  if (err.name === "ValidationError") {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  // Duplicated Email
  if (err.code === 11000) {
    errors.email = "This user already exists !";
  }

  //Login Incorrect email
  if (err.message === "Incorrect email!") {
    errors.email = "This email is not registered!";
  }

  //Login Incorrect password
  if (err.message === "Invalid password!") {
    errors.password = "This password is incorrect!";
  }
  return errors;
};

const createToken = (name) => {
  return jwt.sign({ userName: name }, process.env.SECRET, {
    expiresIn: maxAge,
  });
};

const signinController = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = createToken(user.name);
    res.cookie("token", token, { maxAge: maxAge * 1000, httpOnly: true });
    res.status(201).json({ user });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user.name);
    res.cookie("token", token, { maxAge: maxAge * 1000, httpOnly: true });
    res.status(200).json({ user });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports = { signinController, loginController };
