const express = require("express");
const { createBid, getAllBids } = require("../controllers/bidController");
const router = express.Router();

router.post("/", createBid); //private route
router.get("/:id", getAllBids);

module.exports = router;
