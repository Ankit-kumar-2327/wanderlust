const express = require("express");  // .. means go into parent directory
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing }  = require("../middleware.js");
const listingController  = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });


//INDEX ROUTE
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    //validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
);

//NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

//"/:id" path
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( 
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
)
.delete( 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.destroyListing)
);

//EDIT and UPDATE ROUTE
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingController.editListingForm));

module.exports = router;