const express = require("express");
const router = express.Router();
exports.router = router;
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signup.ejs");
  })
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  .get((req, res) => {
    res.render("users/login.ejs");
  })
  .post(
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
