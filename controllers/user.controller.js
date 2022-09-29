const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const { Comment } = require("../models/comment.model");

//Utils

const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    where: { status: "active" },
    include: [
      { model: Post, include: { model: Comment, include: { model: User } } },
      { model: Comment },
    ],
  });
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (role !== "admin" && role !== "normal") {
    return next(new AppError("Invalid role", 400));
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  //remove password from response

  newUser.password = undefined;

  res.status(201).json({
    status: "Success",
    data: { newUser },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { user } = req;

  //check if the user exist before update

  // const updatedUser = await User.update({ name }, { where: { id } });

  await user.update({ name });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: "delete" });

  res.status(204).json({
    status: "success",
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: "active" },
  });

  // if (!user) {
  //   return res.status(400).json({
  //     status: "error",
  //     message: "User with given email does not exist",
  //   });
  // }

  // const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Wrong credentials", 400));
  }

  user.password = undefined;

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    status: "success",
    data: { user, token },
  });
});
module.exports = { getAllUsers, createUser, updateUser, deleteUser, login };
