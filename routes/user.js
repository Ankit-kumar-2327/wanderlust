const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/users.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(
    wrapAsync(userController.signUpUser)
);

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate('local', { 
        failureRedirect: "/login", 
        failureFlash: true
    }),
    userController.loginUser
);

// log out router
router.get("/logout",userController.logOutUser);

module.exports = router;