const mongoose = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    photoURL: { type: String },
    address: {
      country: { type: String },
      city: { type: String },
      addressLineOne: { type: String },
      addressLineTwo: { type: String },
    },
    role: { type: String },
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
