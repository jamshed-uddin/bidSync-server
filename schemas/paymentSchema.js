const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
