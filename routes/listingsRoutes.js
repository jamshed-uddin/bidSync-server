const express = require("express");
const {
  createAuction,
  getAllAuctions,
  getSingleAuction,
  updateAuction,
  deleteAuction,
} = require("../controllers/listingsController");
const router = express.Router();

router.post("/", createAuction);
router.get("/", getAllAuctions);
router.get("/:id", getSingleAuction);
router.patch("/:id", updateAuction);
router.delete("/:id", deleteAuction);

module.exports = router;
