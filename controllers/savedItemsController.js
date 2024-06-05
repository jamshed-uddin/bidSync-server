const SavedItems = require("../schemas/savedItemsSchema");
const newCustomError = require("../utils/newCustomError");

//@desc create saved item
//route POST/api/savedItems
//access private

const createSavedItem = async (req, res, next) => {
  try {
    const body = req.body;

    const savedItem = await SavedItems.findOne({
      userId: req.user._id,
      auction: body.auction,
    });

    if (savedItem) {
      throw newCustomError(409, "Auction already saved");
    }

    await SavedItems.create({ ...body, userId: req.user._id });

    res.status(201).send({
      message: "Auction saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

//@desc get all savedItem userwise saveditems
//route GET /api/savedItems   id here is userId
//access private

const getAllSavedItems = async (req, res, next) => {
  try {
    const id = req.user._id;

    const savedItems = await SavedItems.find({ userId: id }).populate(
      "auction"
    );

    res.status(200).send({
      message: "Saved auctions retrived",
      data: savedItems,
    });
  } catch (error) {
    next(error);
  }
};
//@desc delete savedItem
//route DELETE /api/savedItems/:id  id here is auction id
//access private

const deleteSavedItem = async (req, res, next) => {
  try {
    const id = req.params.id;

    await SavedItems.deleteOne({ auction: id }, { user: req.user._id });

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
