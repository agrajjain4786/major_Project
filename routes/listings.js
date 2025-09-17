const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingsController = require("../controllers/listings.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");

// index route
router.get("/", wrapAsync(listingsController.index));

// new Listing Route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

// Show Listing Route
router.get("/:id", wrapAsync(listingsController.showListings));
// create route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingsController.createListings)
);

// edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.editListings)
);
// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingsController.updateListings)
);

// delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.deleteListings)
);

module.exports = router;
