const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photoURL: { type: String },
    address: {
      country: { type: String, default: "" },
      zip: { type: Number },
      state: { type: String, default: "" },
      city: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    bankInfoAdded: { type: Boolean, default: false },
    newNotifications: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
