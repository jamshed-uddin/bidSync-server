const SavedItems = require("../schemas/savedItemsSchema");
const Listings = require("../schemas/listingsSchema");
const newCustomError = require("../utils/newCustomError");

//@desc create saved item
//route POST/api/savedItems
//access private

const createSavedItem = async (req, res, next) => {
  try {
    const body = req.body;
    const { auction } = req.body;
    const createdSavedItem = await SavedItems.create(body);
    const auctionInfo = await Listings.findOne({ _id: auction });

    if (auctionInfo) {
      createdSavedItem.auction = auctionInfo;
    }

    req.status(201).send({
      message: "Auction saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

//@desc get all savedItem userwise saveditems
//route GET /api/savedItems/:id    id here is userId
//access private

const getAllSavedItems = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw newCustomError(401, "User identifier required");
    }

    const savedItems = await SavedItems.find({ _id: id });

    res.status(200).send({
      message: "Saved auctions retrived",
      data: savedItems,
    });
  } catch (error) {
    next(error);
  }
};
//@desc delete savedItem
//route DELETE /api/savedItems/:id
//access private

const deleteSavedItem = async (req, res, next) => {
  try {
    const id = req.params.id;

    await SavedItems.deleteOne({ _id: id });

    res.status(200).send({
      message: "Saved auctions deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSavedItem,
  getAllSavedItems,
  deleteSavedItem,
};
