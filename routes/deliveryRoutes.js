const express = require("express");
const {
  createDelivery,
  getAllDeliveries,
  getDelivery,
  updateDeliveryStatus,
} = require("../controllers/deliveryController");
const router = express.Router();

router.post("/", createDelivery);
router.get("/", getAllDeliveries);
router.get("/:id", getDelivery);
router.patch("/:id", updateDeliveryStatus);

module.exports = router;
