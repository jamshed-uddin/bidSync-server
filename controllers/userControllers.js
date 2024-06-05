const User = require("../schemas/userSchema");
const generateJwtToken = require("../utils/generateJwt");
const newCustomError = require("../utils/newCustomError");

//@desc create user
//route POST/api/user
//access public

const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw newCustomError(400, "User with this email already exists");
    }

    const newUser = await User.create({
      name,
      email,
    });

    res.status(201).send({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

//@desc single user
//route GET /api/user/:email
//access PRIVATE
const getSingleUser = async (req, res, next) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email });

    if (!user) {
      throw newCustomError(404, "User not found");
    }

    res.status(200).send({
      message: "User retrived successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//@desc update user
//route PATCH /api/user/:id
//access PRIVATE
const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updated = req.body;
    const user = await User.findOne({ _id: id });

    if (!user) {
      throw newCustomError(404, "User not found");
    }

    const updatedUser = await User.findOneAndUpdate({ _id: id }, updated, {
      new: true,
    });

    res.status(200).send({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

//@desc delete user
//route delete /api/user/:id
//access PRIVATE
const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findOne({ _id: id });

    if (!user) {
      throw newCustomError(404, "User not found");
    }

    await User.deleteOne({ _id: id });

    res.status(200).send({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

//@desc generate jwt token
//route POST /api/user/generateJwtToken
//access public
const getJwtToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    const token = generateJwtToken(email);
    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getJwtToken,
};
