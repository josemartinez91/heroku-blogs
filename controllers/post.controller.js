const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const { Comment } = require("../models/comment.model");

//utils

const { catchAsync } = require("../utils/catchAsync.util");

const getAllPost = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    attributes: ["id", "title", "content", "createdAt"],
    include: [
      { model: User, attributes: ["id", "name"] },
      {
        model: Comment,
        required: false, //apply Outer Join
        where: { status: "active" },
        attributes: ["id", "comment", "createdAt"],
      },
    ],
  });
  res.status(200).json({
    status: "success",
    data: {
      posts,
    },
  });
});

const createPost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { sessionUser } = req;
  const newPost = await Post.create({
    title,
    content,
    userId: sessionUser.id,
  });
  res.status(201).json({
    status: "success",
    data: { newPost },
  });
});

const updatePost = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const { post } = req;

  await post.update({ title });

  res.status(200).json({
    status: "success",
    data: { post },
  });
});

const deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  await post.update({ status: "delete" });

  res.status(204).json({
    status: "success",
  });
});
module.exports = { getAllPost, createPost, updatePost, deletePost };
