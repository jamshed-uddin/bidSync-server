const express = require("express");
const {
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/", createUser);
router.get("/:id", getSingleUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
