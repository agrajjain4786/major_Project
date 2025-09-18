const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingsController = require("../controllers/listings.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const multer = require("multer");

const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingsController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.createListings)
  );

// new Listing Route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingsController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.updateListings)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingsController.deleteListings));

// edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.editListings)
);

module.exports = router;
