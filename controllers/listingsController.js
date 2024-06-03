const Listings = require("../schemas/listingsSchema");
const newCustomError = require("../utils/newCustomError");

//@desc create auction
//route POST/api/listings
//access Private
const createAuction = async (req, res, next) => {
  try {
    const auctionBody = req.body;
    const createdAuction = await Listings.create(auctionBody);
    res.status(201).send({
      message: "Auction created successfully",
      data: { auctionId: createdAuction._id },
    });
  } catch (error) {
    next(error);
  }
};

//@desc get all auction
//route GET/api/listings
//access public
const getAllAuctions = async (req, res, next) => {
  try {
    const category = req.query.category || "";
    const filter = category ? { category } : {};

    const allAuction = await Listings.find(filter).populate("user");

    res.status(200).send({
      message: "All auction retrived",
      data: allAuction,
    });
  } catch (error) {
    next(error);
  }
};
//@desc get all auction userwise (auction listed by user)
//route GET/api/listings/:userId
//access private
const getUsersListings = async (req, res, next) => {
  try {
    const category = req.query.category || "";
    const filter = category ? { category } : {};
    const userId = req.params.userId;

    const allAuction = await Listings.find({ user: userId }, filter).populate(
      "user"
    );

    res.status(200).send({
      message: "All auction retrived",
      data: allAuction,
    });
  } catch (error) {
    next(error);
  }
};

//@desc get single auction
//route GET/api/listings/:id
//access public

const getSingleAuction = async (req, res, next) => {
  try {
    const id = req.params.id;

    const auction = await Listings.findOne({ _id: id }).populate("user");

    if (!auction) {
      throw newCustomError(404, "Auction not found");
    }

    res.status(200).send({
      message: "Auction data retrived",
      data: auction,
    });
  } catch (error) {
    next(error);
  }
};

//@desc update auction
//route patch/api/listings/:id
//access private

const updateAuction = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedBody = req.body;

    const auction = await Listings.findOne({ _id: id });

    if (!auction) {
      throw newCustomError(404, "Auction not found");
    }

    const updatedAuction = await Listings.findOneAndUpdate(
      { _id: id },
      updatedBody,
      { new: true }
    );

    res.status(200).send({
      message: "Auction data updated",
      data: { auctionId: updatedAuction._id },
    });
  } catch (error) {
    next(error);
  }
};

//@desc delete auction
//route DELETE/api/listings/:id
//access private

const deleteAuction = async (req, res, next) => {
  try {
    const id = req.params.id;

    const auction = await Listings.findOne({ _id: id });

    if (!auction) {
      throw newCustomError(404, "Auction not found");
    }

    await Listings.deleteOne({ _id: id });

    res.status(200).send({
      message: "Auction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAuction,
  getAllAuctions,
  getUsersListings,
  getSingleAuction,
  updateAuction,
  deleteAuction,
};
