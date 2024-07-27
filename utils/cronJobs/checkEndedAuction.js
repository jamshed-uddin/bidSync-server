const cron = require("node-cron");
const Listings = require("../../schemas/listingsSchema");
const notifySellerAndWinner = require("../mailingJobs/notifySellerAndWinner");
const {
  generateNotification,
} = require("../../controllers/notificationController");

const checkEndedAuction = async () => {
  const currentDate = new Date();
  const batchSize = 100;

  let hasMore = true;

  while (hasMore) {
    const endedAuctoin = await Listings.find({
      clossesIn: { $lte: currentDate },
      status: "active",
    })
      .populate("user highestBidder")
      .limit(batchSize)
      .exec();

    if (endedAuctoin?.length === 0) {
      hasMore = false;
    } else {
      await Promise.all(
        endedAuctoin?.map(async (auction) => {
          if (
            auction.highestBid > auction.startingPrice &&
            auction.highestBidder
          ) {
            auction.status = "completed";
            auction.paymentDeadline = new Date(
              currentDate.getTime() + 5 * 24 * 60 * 60 * 1000
            );
            await auction.save();
            // sending mail to winner and seller
            notifySellerAndWinner(auction);
            // notification to winner
            await generateNotification({
              recipient: auction.highestBidder,
              message:
                "Congratulations! You have won an auction. Check the email sent to your email accout for further instructions",
              link: `/auctions/${auction._id}`,
            });

            // notification to seller
            await generateNotification({
              recipient: auction.user,
              message:
                "Congratulations! Your item is sold. Check the email sent to your email accout for further instructions",
              link: `/auctions/${auction._id}`,
            });
          } else {
            auction.status = "expired";
            await auction.save();

            // sending notificaiton to relist expired auction
            await generateNotification({
              recipient: auction.user,
              message:
                "The auction for your item is ended. You can relist the item here.",
              link: `/auctions/${auction._id}`,
            });
          }
        })
      );
    }
  }
};

const checkEndedAuctionCronJob = () => {
  cron.schedule("* * * * *", () => {
    console.log("cron job running");
    checkEndedAuction();
  });
};

module.exports = checkEndedAuctionCronJob;
