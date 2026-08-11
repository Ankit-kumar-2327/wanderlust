const User = require("../models/users.js");
const { signToken } = require("../utils/jwt.js");

const setJwtCookie = (res, user) => {
  const token = signToken(user);
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};

module.exports.renderSignupForm = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signUpUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      setJwtCookie(res, registeredUser);
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  setJwtCookie(res, req.user);
  req.flash("success", "Welcome back to WanderLust page!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.apiLoginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const authenticate = User.authenticate();
    const authResult = await new Promise((resolve, reject) => {
      authenticate(username, password, (err, user, options) => {
        if (err) return reject(err);
        return resolve({ user, options });
      });
    });
    if (!authResult.user) {
      return res
        .status(401)
        .json({ error: authResult.options?.message || "Invalid credentials" });
    }
    const token = signToken(authResult.user);
    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports.signUpUserApi = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    const token = signToken(registeredUser);
    return res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports.logOutUser = (req, res, next) => {
  res.clearCookie("jwt");
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out successfully!");
    res.redirect("/listings");
  });
};
