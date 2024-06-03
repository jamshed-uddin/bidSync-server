const express = require("express");
const {
  createAuction,
  getAllAuctions,
  getSingleAuction,
  updateAuction,
  deleteAuction,
} = require("../controllers/listingsController");
const { verifyAccess } = require("../middlewares/verifyAccess");
const router = express.Router();

router.post("/", createAuction); //private route
router.get("/", getAllAuctions);
router.get("/:id", getSingleAuction);
router.patch("/:id", updateAuction); //private route
router.delete("/:id", deleteAuction); //private route

module.exports = router;
