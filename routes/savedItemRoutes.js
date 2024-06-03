const express = require("express");
const {
  createSavedItem,
  getAllSavedItems,
  deleteSavedItem,
} = require("../controllers/savedItemsController");
const router = express.Router();

router.post("/", createSavedItem); //private route
router.get("/", getAllSavedItems); //private route
router.delete("/:id", deleteSavedItem); //private route

module.exports = router;
