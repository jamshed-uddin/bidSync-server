const express = require("express");
const {
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getJwtToken,
} = require("../controllers/userControllers");
const generateJwtToken = require("../utils/generateJwt");
const { verifyAccess } = require("../middlewares/verifyAccess");

const router = express.Router();

router.post("/", createUser);
router.get("/:email", verifyAccess, getSingleUser); //private route
router.post("/generateJwtToken", getJwtToken);
router.patch("/:id", verifyAccess, updateUser); //private route
router.delete("/:id", verifyAccess, deleteUser); //private route

module.exports = router;
