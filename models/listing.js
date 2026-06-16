const mongoose = require("mongoose");
const Review = require("./review.js")
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type : String,
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
    
});
listingSchema.post("findOneAndDelete", async (listing) => {  // as any lisiting is deleted all reviews all get deleted
    if(listing.reviews.length){
        await Review.deleteMany({_id : {$in: listing.review }})
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;