// const passport = require("passport");
// const { saveRedirectUrl } = require("../middleware");
// const { router } = require("../routes/user");
const User = require("../models/user.js");

module.exports.signUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Hi ${registerUser.username}, Welcome to GustHub`);
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.login = async (req, res, next) => {
  let { username } = req.body;
  req.flash("success", `Hi ${username} , Welcome back to GustHub`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", `you are logged out!`);
    res.redirect("/listings");
  });
};
