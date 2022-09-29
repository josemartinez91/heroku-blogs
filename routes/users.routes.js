const express = require("express");
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
} = require("../controllers/user.controller");

//middlewares

const { userExist } = require("../middlewares/users.middlewares");
const { protectSession, protectUsersAccount, protectAdmin } = require("../middlewares/auth.middleware");
const {
  createUserValidators,
} = require("../middlewares/validators.middlewares");

const usersRouter = express.Router();

usersRouter.post("/login", login);

usersRouter.post("/", createUserValidators, createUser);

// Protecting endpoints

usersRouter.use(protectSession);

usersRouter.get("/", protectAdmin, getAllUsers);

usersRouter.patch("/:id", userExist, protectUsersAccount, updateUser);

usersRouter.delete("/:id", userExist, protectUsersAccount, deleteUser);

module.exports = { usersRouter };
