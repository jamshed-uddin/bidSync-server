const Bids = require("../schemas/bidSchema");
const User = require("../schemas/userSchema");

//@desc create bid
//route POST/api/bids
//access private

const createBid = async (req, res, next) => {
  try {
    const body = req.body;
    const { user } = req.body;
    const createdBid = await Bids.create(body);

    const userInfo = await User.findOne({ _id: user });
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

    const allBids = await Bids.find({ _id: id });
    res.status(200).send({
      message: "All bids retrived",
      data: allBids,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBid,
  getAllBids,
};
