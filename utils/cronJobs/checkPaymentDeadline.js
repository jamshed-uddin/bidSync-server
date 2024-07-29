const cron = require("node-cron");
const Listings = require("../../schemas/listingsSchema");
const {
  generateNotification,
} = require("../../controllers/notificationController");

const checkPaymentDeadline = async () => {
  const currentDate = new Date();
  const theDayBefore = new Date(
    currentDate.getTime() - 1 * 24 * 60 * 60 * 1000
  );

  const batchSize = 100;
  let hasMore = true;

  while (hasMore) {
    // const getting the listings that met payment deadline
    const deadlineEnden = await Listings.find({
      paymentDeadline: { $lte: currentDate },
      status: "completed",
    })
      .populate("user highestBidder")
      .limit(batchSize)
      .exec();

    if (deadlineEnden?.length === 0) {
      hasMore = false;
    } else {
      await Promise.all(
        deadlineEnden?.map(async (auction) => {
          auction.status = "unpaid";
          await auction.save();
          // notification to winner
          await generateNotification({
            recipient: auction.highestBidder,
            message:
              "Your did not paid for winning auction within deadline.You are no longer eligible for completing payment.",
            link: `/auctions/${auction._id}`,
          });

          // notification to seller
          await generateNotification({
            recipient: auction.user,
            message:
              "The winner did not complete the payment for your item. You can relist the item.",
            link: `/auctions/${auction._id}`,
          });
        })
      );
    }
  }
};

const checkPaymentDeadlineCronJob = () => {
  cron.schedule("* * * * *", () => {
    console.log("cron job running");
    checkPaymentDeadline();
  });
};

module.exports = checkPaymentDeadlineCronJob;
