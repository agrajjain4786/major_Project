const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

// delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("deleted", `Review Deleted!`);
    res.redirect(`/listings/${id}`);
  })
);

// add review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log(`new review saved`);
    req.flash("success", `New Review Created!`);
    res.redirect(`/listings/${listing._id}`);
  })
);

module.exports = router;
