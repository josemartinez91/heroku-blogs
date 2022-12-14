const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const dotenv = require("dotenv");
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const protectSession = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log(token);

  if (!token) {
    return next(new AppError("The token was invalid", 403));
  }

  // chechk the token

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  // verify the token owner's

  const user = await User.findOne({
    where: { id: decode.id, status: "active" },
  });

  if (!user) {
    return next(
      new AppError("The owner of the session is not longer active", 403)
    );
  }
  req.sessionUser = user;
  next();
});

// Check the sessionUser to compare to the one that wants to be updated/deleted
const protectUsersAccount = (req, res, next) => {
  const { sessionUser, user } = req;
  // const { id } = req.params;

  // If the users (ids) don't match, send an error, otherwise continue
  if (sessionUser.id !== user.id) {
    return next(new AppError("You are not the owner of this account.", 403));
  }

  // If the ids match, grant access
  next();
};

// Create middleware to protect posts, only owners should be able to update/delete
const protectPostsOwners = (req, res, next) => {
  const { sessionUser, post } = req;

  if (sessionUser.id !== post.userId) {
    return next(new AppError("This post does not belong to you.", 403));
  }

  next();
};

// Create middleware to protect comments, only owners should be able to update/delete
const protectCommentsOwners = (req, res, next) => {
  const { sessionUser, comment } = req;

  if (sessionUser.id !== comment.userId) {
    return next(new AppError("This comment does not belong to you.", 403));
  }

  next();
};

// Create middleware that only grants access to admin users
const protectAdmin = (req, res, next) => {
  const { sessionUser } = req;

  if (sessionUser.role !== "admin") {
    return next(
      new AppError("You do not have the access level for this data.", 403)
    );
  }

  next();
};

module.exports = {
  protectSession,
  protectAdmin,
  protectCommentsOwners,
  protectPostsOwners,
  protectUsersAccount,
};
