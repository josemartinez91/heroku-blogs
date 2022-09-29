const express = require("express");
const {
  getAllPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

const { postExist } = require("../middlewares/posts.middlewares");
const {protectSession, protectPostsOwners} = require('../middlewares/auth.middleware')
const {
  createPostValidators,
} = require("../middlewares/validators.middlewares");

const postsRouter = express.Router();

postsRouter.use(protectSession)

postsRouter.get("/", getAllPost);

postsRouter.post("/", createPostValidators, createPost);

postsRouter.patch("/:id", postExist, protectPostsOwners, updatePost);

postsRouter.delete("/:id", postExist, protectPostsOwners, deletePost);

module.exports = { postsRouter };
