const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photoURL: { type: String },
    address: {
      country: { type: String, default: "" },
      city: { type: String, default: "" },
      addressLineOne: { type: String, default: "" },
      addressLineTwo: { type: String, default: "" },
    },
    bankInfoAdded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
