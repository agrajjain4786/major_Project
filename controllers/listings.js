const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("notExist", `The Listing is does not exist any more!`);
    res.redirect("/listings");
  } else {
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
  }
};

module.exports.createListings = async (req, res, next) => {
  let cordinate = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  // console.log(cordinate.body.features[0].geometry);
  // res.send("done");
  let url = req.file.path;
  let filename = req.file.filename;
  const newlisting = new Listing(req.body.listing);
  newlisting.geometry = cordinate.body.features[0].geometry;
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  await newlisting.save();
  // console.log(savedListing);
  req.flash("success", `New "${newlisting.title}" Listing Created!`);
  res.redirect("/listings");
};

module.exports.editListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", `Listing you requested for does not exist!`);
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  let previewUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, previewUrl });
};

module.exports.updateListings = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, `Please send valid data to update listing`);
  }
  let { id } = req.params;
  const newlisting = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    newlisting.image = { url, filename };
    await newlisting.save();
  }
  req.flash("success", `"${newlisting.title}" Listing Edited!`);
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListings = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("deleted", `"${deletedListing.title}" listing is deleted`);
  res.redirect("/listings");
};
