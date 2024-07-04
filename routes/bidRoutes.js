const express = require("express");
const {
  createBid,
  getAllBids,
  getMyBids,
} = require("../controllers/bidController");
const { verifyAccess } = require("../middlewares/verifyAccess");
const router = express.Router();

router.post("/", verifyAccess, createBid); //private route
router.get("/:id", getAllBids);
router.get("/myBids/:userId", verifyAccess, getMyBids);
module.exports = router;
