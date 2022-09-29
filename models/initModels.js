const { Comment } = require("./comment.model");
const { Post } = require("./post.model");
const { User } = require("./user.model");

const initModels = () => {
  // 1 user <----> M post
  User.hasMany(Post, { foreignKey: "userId" });
  Post.belongsTo(User);

  // 1 Post <-----> M comment
  Post.hasMany(Comment, { foreignKey: "postId" });
  Comment.belongsTo(Post);

  // 1 user <-----> M comment
  User.hasMany(Comment, { foreignKey: "userId" });
  Comment.belongsTo(User);
};

module.exports = {initModels}