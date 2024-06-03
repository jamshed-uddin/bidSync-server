const mongoose = require("mongoose");
const savedItemsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listings",
      required: true,
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("SavedItem", savedItemsSchema);
