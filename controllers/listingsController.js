const Listings = require("../schemas/listingsSchema");
const newCustomError = require("../utils/newCustomError");

//@desc create auction
//route POST/api/listings
//access Private
const createAuction = async (req, res, next) => {
  try {
    const auctionBody = req.body;
    const createdAuction = await Listings.create({
      ...auctionBody,
      user: req.user._id,
    });
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
    const query = req.query;
    const searchQuery = query.q;
    const page = +query.page || 1;
    const limit = +query.limit || 2;
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
    const allAuctions = await Listings.find(filter)
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
      message: "All auction retrived",
      data: allAuctions,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems,
        links: {
          self: `/auctions?${
            searchParams && searchParams + "&"
          }page=${page}&limit=${limit}`,
          first: `/auctions?${
            searchParams && searchParams + "&"
          }page=${1}&limit=${limit}`,
          last: `/auctions?${
            searchParams && searchParams + "&"
          }page=${totalPages}&limit=${limit}`,
          prev:
            page > 1
              ? `/auctions?${searchParams && searchParams + "&"}page=${
                  page - 1
                }&limit=${limit}`
              : null,
          next:
            page < totalPages
              ? `/auctions?${searchParams && searchParams + "&"}page=${
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

//@desc get user's won auctins
//route GET/api/listings/wonAuctions
//access private
const getUsersWonAuction = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const wonAuctions = await Listings.find({
      highestBidder: userId,
      status: "completed",
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

//@desc search auction
//route get/api/listings/search?q=''
//access private

const searchAuctions = async (req, res, next) => {
  const searchQuery = req.query.q;

  try {
    if (searchQuery) {
      const auctions = await Listings.find({
        $or: [
          { title: { $regex: new RegExp(searchQuery, "i") } },
          { category: { $regex: new RegExp(searchQuery, "i") } },
        ],
      });

      res.status(200).send({ message: "Query complete", data: auctions });
    } else {
      res.status(200).send({ message: "Query complete", data: [] });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAuction,
  getAllAuctions,
  getUsersListings,
  getUsersWonAuction,
  getSingleAuction,
  updateAuction,
  deleteAuction,
  searchAuctions,
};
