const express = require("express");
const {
  createSavedItem,
  getAllSavedItems,
  deleteSavedItem,
} = require("../controllers/savedItemsController");
const router = express.Router();

router.post("/", createSavedItem);
router.get("/", getAllSavedItems);
router.delete("/:id", deleteSavedItem);

module.exports = router;
