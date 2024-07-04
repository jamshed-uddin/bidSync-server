const mongoose = require("mongoose");
const bidSchema = mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Listing",
    },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", bidSchema);
