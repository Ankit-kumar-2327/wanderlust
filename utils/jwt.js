const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;
if (!secret) {
  throw new Error("JWT secret is required in process.env.SECRET");
}

module.exports.signToken = (user) => {
  const payload = {
    id: user._id?.toString() || user.id,
    username: user.username,
  };
  return jwt.sign(payload, secret, {
    // signature will be generated based on payload and secret key
    expiresIn: "7d",
  });
};

module.exports.verifyToken = (token) => {
  return jwt.verify(token, secret);
};
