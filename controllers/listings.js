const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

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
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }
};

module.exports.createListings = async (req, res, next) => {
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  await newlisting.save();
  req.flash("success", `New "${newlisting.title}" Listing Created!`);
  res.redirect("/listings");
};

module.exports.editListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListings = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, `Please send valid data to update listing`);
  }
  let { id } = req.params;
  const newlisting = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
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
