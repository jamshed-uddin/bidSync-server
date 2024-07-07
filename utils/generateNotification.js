const Notification = require("../schemas/NotificationSchema");

const generateNotification = async (notificationBody) => {
  try {
    const createdNotification = await Notification.create(notificationBody);
    return createdNotification;
  } catch (error) {
    throw Error(error);
  }
};

module.exports = generateNotification;
