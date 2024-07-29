const express = require("express");
const {
  createAuction,
  getAllAuctions,
  getSingleAuction,
  updateAuction,
  deleteAuction,
  getUsersListings,

  getUsersWonAuction,
} = require("../controllers/listingsController");
const { verifyAccess } = require("../middlewares/verifyAccess");
const router = express.Router();

router.post("/", verifyAccess, createAuction); //private route
router.get("/", getAllAuctions);

router.get("/:id", getSingleAuction);
router.get("/myListings/:userId", verifyAccess, getUsersListings); //private route
router.get("/wonAuctions/:userId", verifyAccess, getUsersWonAuction); //private route
router.patch("/:id", verifyAccess, updateAuction); //private route
router.delete("/:id", verifyAccess, deleteAuction); //private route

module.exports = router;
