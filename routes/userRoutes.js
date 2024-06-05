const express = require("express");
const {
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getJwtToken,
} = require("../controllers/userControllers");
const generateJwtToken = require("../utils/generateJwt");

const router = express.Router();

router.post("/", createUser);
router.get("/:email", getSingleUser); //private route
router.post("/generateJwtToken", getJwtToken);
router.patch("/:id", updateUser); //private route
router.delete("/:id", deleteUser); //private route

module.exports = router;
