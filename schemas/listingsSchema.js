const mongoose = require("mongoose");

const listingsSchema = new Schema(
  {
    title: { type: String, required: true },
    photoURL: [{ type: String }],
    description: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    clossesIn: { type: Date, required: true },
    heighestBid: { type: Number, default: 0 },
    heighestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.Schema("Listing", listingsSchema);
