const newCustomError = require("../utils/newCustomError");
const jwt = require("jsonwebtoken");
const User = require("../schemas/userSchema");

const verifyAccess = async (req, res, next) => {
  let token;

  token = req.headers?.authorization;
  console.log("token", token);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findOne({ email: decoded.email });
      next();
    } catch (error) {
      //   throw newCustomError(401, "Unauthorized action.Invalid token");

      res.status(401).send({ message: "Unauthorized action.Invalid token" });
    }
  } else {
    // throw newCustomError(401, "Unauthorized action.No token");

    res.status(401).send({ message: "Unauthorized action.No token" });
  }
};

module.exports = { verifyAccess };
