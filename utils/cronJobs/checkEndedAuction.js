const cron = require("node-cron");
const Listings = require("../../schemas/listingsSchema");
const notifySellerAndWinner = require("../mailingJobs/notifySellerAndWinner");

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

    if (endedAuctoin.length === 0) {
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
          } else {
            auction.status = "expired";
            await auction.save();
          }

          console.log("auction updated");
          console.log(auction);

          notifySellerAndWinner(auction);
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
