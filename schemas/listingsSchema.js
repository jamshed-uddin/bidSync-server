const mongoose = require("mongoose");

const listingsSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    photoURL: [{ type: String }],
    description: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    clossesIn: { type: Date, required: true },
    highestBid: { type: Number, default: 0 },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    category: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "active",
        "completed",
        "expired",
        "shipped",
        "delivered",
        "unpaid",
        "relisted",
      ],
      default: "active",
    },
    paymentDeadline: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingsSchema);
