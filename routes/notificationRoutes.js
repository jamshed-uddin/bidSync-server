const express = require("express");
const {
  createNotification,
  getNotifications,
} = require("../controllers/notificationController");
const { verifyAccess } = require("../middlewares/verifyAccess");
const router = express.Router();

router.post("/", verifyAccess, createNotification);
router.get("/", verifyAccess, getNotifications);

module.exports = router;
