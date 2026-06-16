const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

// create session
const sessionOptions = {
    secret:"secretcode",
    resave: false,
    saveUninitialized: true,
};
/// this middleware triggered for any type of request and create a specifId of session
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {  // middleware trigerred after sending the request by client to server
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/register", (req,res) => {
    let { name = "anonymous"} = req.query; // query string
    req.session.name = name;  // same through all the pages

    if(name === "anonymous"){
        req.flash("error", "Error Occurred: user not found!");
    } else {
        req.flash("success" , "user registered successfully!");
    }
     // for flash the message to user once in form og key- value pair
    res.redirect("/hello");
});

app.get("/hello", (req,res) => {
    res.render("flash.ejs", {name: req.session.name}); // saved information used in the other request these all are same session
})
// app.get("/reqcount", (req,res) => {
//     if(req.session.count){ // created new variable count in req.session object
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     console.log(req.session);
//     res.send(`You sent a request ${req.session.count} times`);
// });

app.get("/test", (req,res) => {
    res.send("test Successful");
});

// ROOT ROUTE
app.get("/", (req, res) => {
    res.send(" Hi I am Root route!");
});

// app.use(cookieParser("SecrateCode")); // cookies-parser middleware // FOR SIGNED COOKIE WE HAVE TO USE STRING AS SECRATE CODE

// // SET Cookies Route
// app.get("/set-cookie", (req, res) => {
//     res.cookie("userName", "Ankit Choudhary", {  // setting cookie
//         maxAge: 36000000,
//     });
//     res.send("Cookies has been set successfully");
// });

// // READ cookies
// app.get("/get-cookie", (req, res) => {
//     console.log(req.cookies);
//     const name = req.cookies.userName;
//     if(name) {
//         res.send(`Your name is ${name}`);
//     } else {
//         res.send("no name related Cookie FOund");
//     }
// });

// // DELETE COOKIE
// app.get("/clear-cookie", (req, res) => {
//     res.clearCookie("userName");
//     res.send("Cookies has been deleted Successfully");
// });

app.listen(port, (req,res) => {
    console.log("server is listening on port", port);
});

