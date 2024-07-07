const Delivery = require("../schemas/deliverySchema");

//@desc create delivery info
//route POST/api/delivery
//access private
const createDelivery = async (req, res, next) => {
  try {
    const deliveryInfo = req.body;

    const createdDelivery = await Delivery.create(deliveryInfo);
    res
      .status(201)
      .send({ message: "Delivery info saved", data: createdDelivery });
  } catch (error) {
    next(error);
  }
};

//@desc get all delivery info
//route GET/api/delivery
//access private
const getAllDeliveries = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const allDeliveries = await Delivery.find({ recipient: userId });

    res
      .status(200)
      .send({ message: "All deliveries retrieved", data: allDeliveries });
  } catch (error) {
    next(error);
  }
};

//@desc get delivery info id in query params
//route GET/api/delivery/:id
//access private
const getDelivery = async (req, res, next) => {
  try {
    const deliveryId = req.params.id;

    const delivery = await Delivery.findOne({ _id: deliveryId });
    res
      .status(200)
      .send({ message: "Delivery info retrieved", data: delivery });
  } catch (error) {
    next(error);
  }
};

//@desc update delivery status  id in query params
//route PATCH/api/delivery/:id
//access private
const updateDeliveryStatus = async (req, res, next) => {
  try {
    const deliveryId = req.params.id;
    const { status } = req.body;

    const delivery = await Delivery.findOneAndUpdate(
      { _id: deliveryId },
      { status },
      { new: true }
    );
    res
      .status(200)
      .send({ message: "Delivery status updated", data: delivery });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDelivery,
  getAllDeliveries,
  getDelivery,
  updateDeliveryStatus,
};
