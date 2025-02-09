const express = require("express");
const {
  getUsersListings,
  getUsersWonAuction,
  listAnItem,
  getAllListings,
  getSingleItem,
  updateItem,
  deleteItem,
  uploadImage,
  deleteImage,
} = require("../controllers/listingsController");
const { verifyAccess } = require("../middlewares/verifyAccess");
const upload = require("../middlewares/multerUploadMid");
const router = express.Router();

router.post("/image/upload", verifyAccess, upload, uploadImage); //private
router.post("/image/delete", verifyAccess, deleteImage); //private
router.post("/", verifyAccess, listAnItem); //private route
router.get("/", getAllListings);

router.get("/:id", getSingleItem);
router.get("/myListings/:userId", verifyAccess, getUsersListings); //private route
router.get("/wonAuctions/:userId", verifyAccess, getUsersWonAuction); //private route
router.patch("/:id", verifyAccess, updateItem); //private route
router.delete("/:id", verifyAccess, deleteItem); //private route

module.exports = router;
