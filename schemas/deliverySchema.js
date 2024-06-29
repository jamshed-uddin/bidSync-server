const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "in_progress", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);
