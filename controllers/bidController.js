const Bids = require("../schemas/bidSchema");
const User = require("../schemas/userSchema");
const Listing = require("../schemas/listingsSchema");
const newCustomError = require("../utils/newCustomError");
const { generateNotification } = require("./notificationController");

//@desc create bid
//route POST/api/bids
//access private

const createBid = async (req, res, next) => {
  try {
    const { currentBidId, ...body } = req.body;
    const { auctionId, amount } = req.body;
    const currentBid = await Bids.findOne({ _id: currentBidId });
    const auctionInfo = await Listing.findOne({ _id: auctionId });
    const userInfo = await User.findOne({ _id: req.user._id });

    if (!auctionInfo) {
      throw newCustomError(404, "Auction not found");
    }
    if (auctionInfo.status !== "active") {
      throw newCustomError(401, "Auction is not active");
    }

    if (auctionInfo.startingPrice > amount || auctionInfo.highestBid > amount) {
      throw newCustomError(
        401,
        "Biddng amount must be greater than last bid and starting price"
      );
    }

    const createdBid = await Bids.create({ ...body, user: req.user._id });
    // updating auction highestBid and highestBidder
    auctionInfo.highestBid = createdBid.amount;
    auctionInfo.highestBidder = createdBid.user;
    await auctionInfo.save();

    if (currentBid) {
      // marking previous bid as outbidded
      currentBid.status = "outbidded";
      await currentBid.save();

      // sending notification to the previous bidder
      await generateNotification({
        recipient: currentBid.user,
        message: `You are outbidded in auction for ${auctionInfo?.title}`,
        link: `/auctions/${auctionInfo._id}`,
      });
    }

    if (userInfo) {
      createdBid.user = userInfo;
    }

    res.status(201).send({
      message: "Bid created successfully",
      data: createdBid,
    });
  } catch (error) {
    next(error);
  }
};

//@desc get all bid  -auctionwise
//route GET/api/bids/:id   id here is the auction id
//access public

const getAllBids = async (req, res, next) => {
  try {
    const id = req.params.id;

    const allBids = await Bids.find({ auctionId: id })
      .sort({ amount: -1 })
      .populate("user")
      .exec();
    res.status(200).send({
      message: "All bids retrived",
      data: allBids,
    });
  } catch (error) {
    next(error);
  }
};
//@desc get all bid  -user wise
//route GET/api/bids/mybids   id here is the user id
//access public
const getMyBids = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const bids = await Bids.find({ user: userId })
      .sort({ amount: -1 })
      .populate("auctionId");

    const myBids = bids?.map((bid) => {
      const auction = bid.auctionId.toObject();
      delete auction.status;

      return { ...auction, bidStatus: bid.status, amount: bid.amount };
    });

    res.status(200).send({
      message: "Users bids retrieved",
      data: myBids,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBid,
  getAllBids,
  getMyBids,
};
