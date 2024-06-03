const jwt = require("jsonwebtoken");

const generateJwtToken = (userEmail) => {
  const token = jwt.sign(
    { id: userId, email: userEmail },
    process.env.JWT_SECRET,
    {
      expiresIn: "600",
    }
  );
};

module.exports = generateJwtToken;
