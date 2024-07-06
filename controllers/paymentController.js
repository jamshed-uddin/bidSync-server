const stripe = require("stripe")(process.env.STRIPE_SECRET);
const StripeAccount = require("../schemas/StripeAccountSchema");
const Payment = require("../schemas/paymentSchema");
const User = require("../schemas/userSchema");
const newCustomError = require("../utils/newCustomError");
//@desc save payment info
//route POST/api/payment
//access private
const savePaymentInfo = async (req, res, next) => {
  try {
    const body = req.body;
    const paymentInfo = { payer: req.user._id, ...body };

    const paymentData = await Payment.create(paymentInfo);
    res.status(201).send({ message: "Payment info saved", data: paymentData });
  } catch (error) {
    next(error);
  }
};
//@desc get all payment info.user id in query
//route GET/api/payment
//access private
const getAllPaymentInfo = async (req, res, next) => {
  try {
    const myPayments = await Payment.find({ payer: req.user._id });

    res
      .status(200)
      .send({ message: "Payments data retrieved", data: myPayments });
  } catch (error) {
    next(error);
  }
};

//@desc connect and board user to stripe .
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

    await StripeAccount.create({
      user: userId,
      stripeAccountId: account.id,
      status: "pending",
    });

    res.status(201).send({ account: account, accountLinks: accountLinks });
  } catch (error) {
    next(error);
  }
};

//@desc check for onboard status whether onboarding is complete or not
//route POST/api/payment/checkOnboardStatus
//access private
const checkOnboardStatus = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const userInfo = await User.findOne({ _id: userId });
    const stripeAccountFromDb = await StripeAccount.findOne({ user: userId });

    if (userInfo.bankInfoAdded) {
      throw newCustomError(409, "Bank info already added.");
    }

    if (!stripeAccountFromDb) {
      throw newCustomError(404, "No stripe account found");
    }

    const account = await stripe.accounts.retrieve(
      stripeAccountFromDb.stripeAccountId
    );

    if (
      account.details_submitted &&
      account.payouts_enabled &&
      account.requirements.disabled_reason === null
    ) {
      stripeAccountFromDb.status = "complete";
      userInfo.bankInfoAdded = true;
      await stripeAccountFromDb.save();
      await userInfo.save();
    }

    res.status(200).send({ message: "Account info updated" });
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
const createSecret = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userStripeAccount = await StripeAccount.findOne({ user: userId });
    const { amount } = req.body;
    const ammountInCent = Math.ceil(Number(amount * 100));
    const parcentage = 2 / 100;
    const applicationFee = Math.round(ammountInCent * parcentage);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: ammountInCent,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },

      application_fee_amount: applicationFee,
      transfer_data: {
        destination: userStripeAccount?.stripeAccountId,
      },
    });

    res.status(201).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  savePaymentInfo,
  getAllPaymentInfo,
  connectAndOnboardUser,
  checkOnboardStatus,
  dashboardLoginLink,
  createSecret,
};
