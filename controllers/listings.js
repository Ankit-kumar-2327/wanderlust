const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req,res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req,res) => { 
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req,res,next) => {
    let coordinate = await geocodingClient.forwardGeocode( {
        query: req.body.listing.location,
        limit: 1
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = new Listing(req.body.listing); // instance of Listing collection
    newListing.owner = req.user._id; // bydefault saved by passport
    newListing.image = { url, filename};

    newListing.geometry = coordinate.body.features[0].geometry;
    await newListing.save();

    req.flash("success", "new listing added successfully!");
    res.redirect("/listings"); 
};

module.exports.showListing = async (req,res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    .populate({path:"reviews", populate: {path: "createdBy"}})
    .populate("owner");

    console.log(listing);
    if(!listing){
        req.flash("error", "listing you requested for does not exit");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", { listing });
    }
};

module.exports.editListingForm = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "listing you try to edit does not exist");
        res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_200");
    res.render("listings/edit.ejs", {listing, originalUrl});
};

module.exports.updateListing = async (req,res) => {
    let{ id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});   // return promise we have to await 
    if(typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url, filename};
        await updatedListing.save();
    }
    req.flash("success", "listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted successfully!");
    res.redirect("/listings");
};

