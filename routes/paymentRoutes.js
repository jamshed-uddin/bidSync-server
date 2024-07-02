const express = require("express");
const {
  savePaymentInfo,
  getAllPaymentInfo,
  createSecret,
  connectAndOnboardUser,
  dashboardLoginLink,
} = require("../controllers/paymentController");
const router = express.Router();

router.post("/", savePaymentInfo); //private
router.get("/", getAllPaymentInfo); //private
router.post("/connectAndOnboardUser", connectAndOnboardUser); //private
router.post("/dashboardLoginLink", dashboardLoginLink); //private
router.post("/secret", createSecret); //private

module.exports = router;
