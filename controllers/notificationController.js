const Notification = require("../schemas/NotificationSchema");
const User = require("../schemas/userSchema");

const generateNotification = async (notificationBody) => {
  try {
    const { recipient } = notificationBody;
    const user = await User.findOne({ _id: recipient });
    const createdNotification = await Notification.create(notificationBody);

    if (user) {
      user.newNotifications = true;
      await user.save();
    }

    return createdNotification;
  } catch (error) {
    return error;
  }
};

//@desc createNotification
//route POST/api/notifications
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
//route GET/api/notifications
//access private

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ recipient: userId });

    res
      .status(200)
      .send({ message: "Notification retrieved", data: notifications });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNotification, getNotifications, generateNotification };
