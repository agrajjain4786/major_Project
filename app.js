const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const method = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(method("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: "mysupersecreatcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.deleted = req.flash("deleted");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

app.get("/demouser", async (req, res, next) => {
  let fakeUser = new User({
    email: "abcd@gmail.com",
    username: "abcd",
  });
  let registerdUser = await User.register(fakeUser, "password");
  res.send(registerdUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

main()
  .then(() => {
    console.log(`database Connected`);
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/majoreProject");
}

// This will run when no other route matched
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = `Something went wronge` } = err;
  res.status(statusCode).render("error.ejs", { err });
});

let port = 8080;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
