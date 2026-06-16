if(process.env.NODE_ENV != "production") {
    require("dotenv").config(); 
} 

const express = require("express");  //ejs bydefault required by express
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-Override");
const ejsMate = require("ejs-mate");
const app = express();
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo').default;
console.log(MongoStore);
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");

app.engine("ejs" , ejsMate); 
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));
const DB_URL = process.env.ATLAS_MONGODB_URL;

main().then(() => {console.log("Database connected sucessfully");})
.catch((err) => { console.log(err);});

async function main(){  // returns promise so then and catch method apply
    await mongoose.connect(DB_URL);
}

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60  
});
store.on("error", () => {
    console.log("Error in MongoSession Store", error);
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
// app.get("/", (req,res) => {
//     res.send("Request is on root Route");
// });


app.use(session(sessionOptions));
app.use(flash());

 // USER AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session()); // same user in different tab but same session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => { 
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// RESTRUCTURING THE LISTINGS AND REVIEW
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((err, req, res, next) => {
   let { statusCode = 500, message = "Something went wrong" } = err;
   res.render("error.ejs", { err });
});

app.listen(8080, () => {
    console.log("server is listening to port 8080 ");
});

