const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { buildListingSearchQuery } = require("../utils/listingSearch.js");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapToken
  ? mbxGeocoding({ accessToken: mapToken })
  : null;

module.exports.index = async (req, res) => {
  const searchTerm = req.query.search || "";
  const searchQuery = buildListingSearchQuery(searchTerm);
  let allListings = await Listing.find(searchQuery);

  res.render("listings/index.ejs", { allListings, searchTerm });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  if (!req.file || !req.file.path) {
    req.flash("error", "Please upload an image for your listing.");
    return res.redirect("/listings/new");
  }

  let geometry = {
    type: "Point",
    coordinates: [0, 0],
  };

  try {
    let coordinate = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    if (coordinate?.body?.features?.length) {
      geometry = coordinate.body.features[0].geometry;
    }
  } catch (error) {
    console.log("Geocoding failed:", error.message);
  }

  let url = req.file.path;
  let filename = req.file.filename;

  let newListing = new Listing(req.body.listing); // instance of Listing collection
  newListing.owner = req.user._id; // bydefault saved by passport
  newListing.image = { url, filename };
  newListing.geometry = geometry;
  await newListing.save();

  req.flash("success", "new listing added successfully!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "createdBy" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "listing you requested for does not exit");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.renderReservePage = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate("owner");
  if (!listing) {
    req.flash("error", "listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/reserve.ejs", { listing });
};

module.exports.editListingForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing you try to edit does not exist");
    res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_200");
  res.render("listings/edit.ejs", { listing, originalUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true },
  ); // return promise we have to await
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }
  req.flash("success", "listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "listing deleted successfully!");
  res.redirect("/listings");
};
