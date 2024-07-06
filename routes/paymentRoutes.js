const express = require("express");
const {
  savePaymentInfo,
  getAllPaymentInfo,
  createSecret,
  connectAndOnboardUser,
  dashboardLoginLink,
  checkOnboardStatus,
} = require("../controllers/paymentController");
const { verifyAccess } = require("../middlewares/verifyAccess");
const router = express.Router();

router.post("/", verifyAccess, savePaymentInfo); //private
router.get("/", verifyAccess, getAllPaymentInfo); //private
router.post("/connectAndOnboardUser", connectAndOnboardUser); //private
router.post("/checkOnboardStatus", verifyAccess, checkOnboardStatus); //private
router.post("/dashboardLoginLink", verifyAccess, dashboardLoginLink); //private
router.post("/secret", verifyAccess, createSecret); //private

module.exports = router;
