const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// new Listing Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Listing Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("notExist", `The Listing is does not exist any more!`);
      res.redirect("/listings");
    } else {
      res.render("listings/show.ejs", { listing });
    }
  })
);
// create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success", `New "${newlisting.title}" Listing Created!`);
    res.redirect("/listings");
  })
);

// edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);
// update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, `Please send valid data to update listing`);
    }
    let { id } = req.params;
    const newlisting = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    req.flash("success", `"${newlisting.title}" Listing Edited!`);
    res.redirect(`/listings/${id}`);
  })
);

// delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("deleted", `"${deletedListing.title}" listing is deleted`);
    res.redirect("/listings");
  })
);

module.exports = router;
