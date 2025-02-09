const Listings = require("../schemas/listingsSchema");
const { uploadToCloud, deleteFromCloud } = require("../utils/cloudinaryOps");
const newCustomError = require("../utils/newCustomError");

// @desc upload image to cloudinary
//route POST/api/listings/image/upload
//access Private
const uploadImage = async (req, res, next) => {
  try {
    const files = req.files;

    if (!files.length || !files) {
      throw newCustomError(400, "Files is missing");
    }

    const uploadPromisses = files.map((file) => uploadToCloud(file));

    const uploadResult = await Promise.all(uploadPromisses);

    res.status(200).send({ urls: uploadResult });
  } catch (error) {
    next(error);
  }
};
// @desc delete image
//route POST/api/listings/image/delete
//access Private
const deleteImage = async (req, res, next) => {
  try {
    const { publicIds } = req.body;
    if (!publicIds?.length) {
      throw newCustomError(400, "PublicId is missing");
    }
    await deleteFromCloud(publicIds);
    res.status(200).send({ message: "Image deleted" });
  } catch (error) {
    next(error);
  }
};

//@desc create auction
//route POST/api/listings
//access Private
const listAnItem = async (req, res, next) => {
  try {
    const itemBody = req.body;
    const createdItem = await Listings.create({
      ...itemBody,
      user: req.user._id,
    });
    res.status(201).send({
      message: "Item listed successfully",
      data: { itemId: createdItem._id },
    });
  } catch (error) {
    next(error);
  }
};

//@desc get all auction
//route GET/api/listings
//access public
const getAllListings = async (req, res, next) => {
  try {
    const query = req.query;
    const searchQuery = query.q;
    const page = +query.page || 1;
    const limit = +query.limit || 15;
    const category = query.category || "";
    const status = "active";

    let filter = { status };

    // mongodb $and operator array for multiple $or operator in single filter
    const andOptions = [];

    // adding category in filter
    if (category) {
      filter.category = new RegExp(category, "i");
    }

    // adding searchQuery $or operator in andOptions
    if (searchQuery) {
      andOptions.push({
        $or: [
          { title: { $regex: new RegExp(searchQuery, "i") } },
          { category: { $regex: new RegExp(searchQuery, "i") } },
        ],
      });
    }

    // adding minPrice $or operator in andOptions

    if (query.minPrice) {
      andOptions.push({
        $or: [
          { highestBid: { $exists: true, $gte: query.minPrice } },
          {
            highestBid: { $exists: false },
            startingPrice: { $gte: query.minPrice },
          },
        ],
      });
    }

    // adding max $or operator in andOptions

    if (query.maxPrice) {
      andOptions.push({
        $or: [
          { highestBid: { $exists: true, $lte: query.maxPrice } },
          {
            highestBid: { $exists: false },
            startingPrice: { $lte: query.maxPrice },
          },
        ],
      });
    }

    // adding $and options array to filter if there is any element in it
    if (andOptions.length > 0) {
      filter.$and = andOptions;
    }

    // sorting
    let sortBy = { createdAt: -1 };
    if (query?.sort) {
      sortBy[query?.sort] =
        query?.order && query?.order.toLowerCase() === "desc" ? -1 : 1;
    }

    // querying database with all options
    const allItems = await Listings.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortBy)
      .populate("user")
      .exec();

    // const totalItems = await Listings.countDocuments(filter).exec();
    const items = await Listings.find(filter).exec();
    const totalItems = items?.length;
    const totalPages = Math.ceil(totalItems / limit);
    const searchParams = searchQuery ? `q=${searchQuery}` : "";
    const response = {
      message: "All listings retrived",
      data: allItems,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems,
        links: {
          self: `/listings?${
            searchParams && searchParams + "&"
          }page=${page}&limit=${limit}`,
          first: `/listings?${
            searchParams && searchParams + "&"
          }page=${1}&limit=${limit}`,
          last: `/listings?${
            searchParams && searchParams + "&"
          }page=${totalPages}&limit=${limit}`,
          prev:
            page > 1
              ? `/listings?${searchParams && searchParams + "&"}page=${
                  page - 1
                }&limit=${limit}`
              : null,
          next:
            page < totalPages
              ? `/listings?${searchParams && searchParams + "&"}page=${
                  page + 1
                }&limit=${limit}`
              : null,
        },
      },
    };

    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};
//@desc get all auction userwise (auction listed by user)
//route GET/api/listings/myListings/:userId
//access private
const getUsersListings = async (req, res, next) => {
  try {
    const category = req.query.category || "";
    const filter = category
      ? { category: new RegExp(`^${category}$`, "i") }
      : {};
    const userId = req.params.userId;

    const allItems = await Listings.find({ user: userId }, filter).populate(
      "user"
    );

    res.status(200).send({
      message: "All Items retrived",
      data: allItems,
    });
  } catch (error) {
    next(error);
  }
};

//@desc get user's won auctins
//route GET/api/listings/wonAuctions
//access private
const getUsersWonAuction = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const wonAuctions = await Listings.find({
      highestBidder: userId,
      status: { $ne: "active" },
    })
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();

    res
      .status(200)
      .send({ message: "Won auctions retrieved", data: wonAuctions });
  } catch (error) {
    next(error);
  }
};

//@desc get single auction
//route GET/api/listings/:id
//access public

const getSingleItem = async (req, res, next) => {
  try {
    const id = req.params.id;

    const item = await Listings.findOne({ _id: id }).populate("user");

    if (!item) {
      throw newCustomError(404, "Item not found");
    }

    res.status(200).send({
      message: "Item data retrived",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

//@desc update auction
//route patch/api/listings/:id
//access private

const updateItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedBody = req.body;

    const item = await Listings.findOne({ _id: id });

    if (!item) {
      throw newCustomError(404, "Item not found");
    }

    const updatedItem = await Listings.findOneAndUpdate(
      { _id: id },
      updatedBody,
      { new: true }
    );

    res.status(200).send({
      message: "Item data updated",
      data: { itemId: updatedItem._id },
    });
  } catch (error) {
    next(error);
  }
};

//@desc delete auction
//route DELETE/api/listings/:id
//access private

const deleteItem = async (req, res, next) => {
  try {
    const id = req.params.id;

    const item = await Listings.findOne({ _id: id });

    if (!item) {
      throw newCustomError(404, "Item not found");
    }

    await Listings.deleteOne({ _id: id });

    res.status(200).send({
      message: "Item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  listAnItem,
  getAllListings,
  getUsersListings,
  getUsersWonAuction,
  getSingleItem,
  updateItem,
  deleteItem,
};
