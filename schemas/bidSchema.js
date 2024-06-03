const mongoose = require("mongoose");
const bidSchema = mongoose.Schema(
  {
    auctionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Bids", bidSchema);
