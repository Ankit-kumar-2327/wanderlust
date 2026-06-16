const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.postReview = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.createdBy = req.user._id;
 
    await listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "new review created");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req,res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " review deleted");
    res.redirect(`/listings/${id}`);
}