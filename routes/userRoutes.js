const express = require("express");
const {
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");
const generateJwtToken = require("../utils/generateJwt");

const router = express.Router();

router.post("/", createUser);
router.get("/:id", getSingleUser); //private route
router.get("/generateJwtToken/:userEmail", generateJwtToken);
router.patch("/:id", updateUser); //private route
router.delete("/:id", deleteUser); //private route

module.exports = router;
