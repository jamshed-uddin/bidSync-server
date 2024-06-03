const express = require("express");
const {
  createAuction,
  getAllAuctions,
  getSingleAuction,
  updateAuction,
  deleteAuction,
  getUsersListings,
} = require("../controllers/listingsController");
const { verifyAccess } = require("../middlewares/verifyAccess");
const router = express.Router();

router.post("/", createAuction); //private route
router.get("/", getAllAuctions);
router.get("/:id", getSingleAuction);
router.get("/:userId", getUsersListings); //private route
router.patch("/:id", updateAuction); //private route
router.delete("/:id", deleteAuction); //private route

module.exports = router;
