const express = require("express");
const router = express.Router();
exports.router = router;
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(userController.signUp));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    // saveRedirectUrl,
    // passport.authenticate("local", {
    //   failureRedirect: "/login",
    //   failureFlash: true,
    // the main work of login is done by these ☝️⬆️ comments
  }),
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;
