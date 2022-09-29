const express = require("express");

const {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} = require("../controllers/comment.controller");

const {commentExists} = require('../middlewares/comments.middlewares')
const {protectSession, protectCommentsOwners} = require('../middlewares/auth.middleware')

const commentsRoute = express.Router();

commentsRoute.use(protectSession)

commentsRoute.get("/", getAllComments);

commentsRoute.post("/", createComment);

commentsRoute.patch("/:id", commentExists, protectCommentsOwners, updateComment);

commentsRoute.delete("/:id", commentExists, protectCommentsOwners, deleteComment);


module.exports = {commentsRoute}