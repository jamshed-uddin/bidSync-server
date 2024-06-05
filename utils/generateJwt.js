const jwt = require("jsonwebtoken");

const generateJwtToken = (userEmail) => {
  const token = jwt.sign({ email: userEmail }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

module.exports = generateJwtToken;
