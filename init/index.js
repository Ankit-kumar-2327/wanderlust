const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("Database connected sucessfully");
})
.catch((err) => {
    console.log(err);
});

async function main(){  // returns promise so then and catch method apply
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
    await Listing.deleteMany({});  // deltes all the exisitng data from DB
    initData.data = initData.data.map(obj => ({...obj, owner: "6a2b8079b25bc94cb4fc21a1"}));
    await Listing.insertMany(initData.data);  // initialized with sample data
    console.log("data was inserted into DB");
}

initDB();