const User = require("../models/users.js");

module.exports.renderSignupForm =  (req,res) => {
    res.render("user/signup.ejs");
};

module.exports.signUpUser = async (req, res) => {
    try{
        let { username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
        if(err) {
            return next(err);
        }
        req.flash("success" , "Welcome to WanderLust!");
        res.redirect("/listings");
        });

    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm =  (req, res) => {
    res.render("user/login.ejs");
};
module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust page!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logOutUser =  (req, res) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success" , "You are logged out successfully!");
        res.redirect("/listings");
    });
};