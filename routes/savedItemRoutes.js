const express = require("express");
const {
  createSavedItem,
  getAllSavedItems,
  deleteSavedItem,
} = require("../controllers/savedItemsController");
const { verifyAccess } = require("../middlewares/verifyAccess");
const router = express.Router();

router.post("/", verifyAccess, createSavedItem); //private route
router.get("/", verifyAccess, getAllSavedItems); //private route
router.delete("/:id", verifyAccess, deleteSavedItem); //private route

module.exports = router;
