const Bids = require("../schemas/bidSchema");
const User = require("../schemas/userSchema");
const Listing = require("../schemas/listingsSchema");
const newCustomError = require("../utils/newCustomError");

//@desc create bid
//route POST/api/bids
//access private

const createBid = async (req, res, next) => {
  try {
    const body = req.body;
    const { auctionId, amount } = req.body;
    const auctionInfo = await Listing.findOne({ _id: auctionId });
    const userInfo = await User.findOne({ _id: req.user._id });

    if (!auctionInfo) {
      throw newCustomError(404, "Auction not found");
    }

    if (auctionInfo.startingPrice > amount || auctionInfo.highestBid > amount) {
      throw newCustomError(
        401,
        "Biddng amount must be greater than last bid and starting price"
      );
    }
    const createdBid = await Bids.create({ ...body, user: req.user._id });

    auctionInfo.highestBid = createdBid.amount;
    auctionInfo.highestBidder = createdBid.user;
    await auctionInfo.save();

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
    console.log(userId);

    const myBids = await Bids.find({ user: userId })
      .sort({ amount: -1 })
      .populate("auctionId")
      .exec();

    res.status(200).send({
      message: "Users bids retrieved",
      data: myBids?.map((item) => item.auctionId),
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
