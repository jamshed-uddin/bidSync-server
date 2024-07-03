const mongoose = require("mongoose");

const stripeAccountSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripeAccountId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "complete"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StripeAccount", stripeAccountSchema);
