const stripe = require("stripe")(process.env.STRIPE_SECRET);
const StripeAccount = require("../schemas/StripeAccountSchema");
const User = require("../schemas/userSchema");
const newCustomError = require("../utils/newCustomError");
//@desc save payment info
//route POST/api/payment
//access private
const savePaymentInfo = async () => {};
//@desc get all payment info.user id in query
//route GET/api/payment
//access private
const getAllPaymentInfo = async () => {};

//@desc connect and board user to stripe . may take some parameter in query
//route GET/api/payment/connectAndBoardUser
//access private
const connectAndOnboardUser = async (req, res, next) => {
  try {
    const { email, userId } = req.body;
    const stripeAccount = await StripeAccount.findOne({ user: userId });

    if (stripeAccount) {
      throw newCustomError(
        409,
        " You have already added your bank account information."
      );
    }

    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: email,
    });

    const accountLinks = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "http://localhost:5173/dashboard/profile",
      return_url: "http://localhost:5173/dashboard/profile",
      type: "account_onboarding",
    });

    await StripeAccount.create({ user: userId, stripeAccountId: account.id });
    await User.findOneAndUpdate({ _id: userId }, { bankInfoAdded: true });

    res.status(201).send({ account: account, accountLinks: accountLinks });
  } catch (error) {
    next(error);
  }
};

//@desc stripe dashboard link for onborded account
//route GET/api/payment/dashboardLoginLink
//access private
const dashboardLoginLink = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const stripeAccount = await StripeAccount.findOne({ user: userId });

    if (!stripeAccount) {
      throw newCustomError(404, "No stripe account found");
    }

    const loginLink = await stripe.accounts.createLoginLink(
      stripeAccount.stripeAccountId
    );

    res.status(200).send({ message: "success", url: loginLink.url });
  } catch (error) {
    next(error);
  }
};

//@desc create client_secret by create payment intent
//route GET/api/payment/secret
//access private
const createSecret = async () => {};

module.exports = {
  savePaymentInfo,
  getAllPaymentInfo,
  connectAndOnboardUser,
  dashboardLoginLink,
  createSecret,
};
