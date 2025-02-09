const mongoose = require("mongoose");

const listingsSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    photoURL: [{ url: { type: String }, publicId: { type: String } }],
    description: { type: String, required: true },
    startingPrice: { type: Number },
    clossesIn: { type: Date },
    highestBid: { type: Number, default: 0 },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    format: { type: String, enum: ["auction", "buyItNow"] },
    priceForBuyItNow: { type: Number },
    category: { type: String, required: true },
    details: [{ title: { type: String }, value: { type: String } }],
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
      ],
      default: "active",
    },
    paymentDeadline: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingsSchema);
