const express = require("express");
const {
  createDelivery,
  getAllDeliveries,
  getDelivery,
  updateDeliveryStatus,
} = require("../controllers/deliveryController");
const { verifyAccess } = require("../middlewares/verifyAccess");
const router = express.Router();

router.post("/", verifyAccess, createDelivery);
router.get("/", verifyAccess, getAllDeliveries);
router.get("/:id", verifyAccess, getDelivery);
router.patch("/:id", verifyAccess, updateDeliveryStatus);

module.exports = router;
