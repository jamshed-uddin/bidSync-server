const cron = require("node-cron");
const Listings = require("../../schemas/listingsSchema");

const checkEndedAuction = async () => {
  const currentDate = new Date();
  const batchSize = 100;

  let hasMore = true;

  while (hasMore) {
    const endedAuctoin = await Listings.find({
      clossesIn: { $lte: currentDate },
      status: "active",
    })
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
          } else {
            auction.status = "expired";
          }

          await auction.save();
        })
      );
    }
  }
};

const checkEndedAuctionCronJob = () => {
  cron.schedule("* * * * * *", () => {
    console.log("cron job running");
  });
};

module.exports = checkEndedAuctionCronJob;
