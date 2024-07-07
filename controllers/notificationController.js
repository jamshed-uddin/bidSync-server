const Notification = require("../schemas/NotificationSchema");

//@desc createNotification
//route POST/api/notification
//access private

const createNotification = async (req, res, next) => {
  try {
    const notificationBody = req.body;

    const createdNotification = await Notification.create({ notificationBody });

    res
      .status(201)
      .send({ message: "Notification created", data: createdNotification });
  } catch (error) {
    next(error);
  }
};
//@desc get notifications
//route GET/api/notification
//access private

const getNotifications = async (req, res, next) => {
  try {
    const body = req.body;
    const userId = req.user._id;

    const notifications = await Notification.find({ recipient: userId });

    res
      .status(200)
      .send({ message: "Notification retrieved", data: notifications });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNotification, getNotifications };
