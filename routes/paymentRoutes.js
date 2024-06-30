const express = require("express");
const {
  savePaymentInfo,
  getAllPaymentInfo,
  connectAndBoardUser,
  createSecret,
} = require("../controllers/paymentController");
const router = express.Router();

router.post("/", savePaymentInfo); //private
router.get("/", getAllPaymentInfo); //private
router.post("/connectAndBoardUser", connectAndBoardUser); //private
router.post("/secret", createSecret); //private

module.exports = router;
