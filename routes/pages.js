const express = require("express");
const characters = require("../data");
const {
  signinController,
  loginController,
} = require("../controllers/userControllers");
const { authentication } = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router
  .route("/signin")
  .get((req, res) => {
    res.render("signin");
  })
  .post(signinController);

router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(loginController);

router.route("/logout").get((req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.redirect("/");
});

router.get("/characters", authentication, (req, res) => {
  res.render("characters", { characters });
});

module.exports = router;
