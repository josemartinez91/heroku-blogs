const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

//create model

const { usersRouter } = require("./routes/users.routes");
const { postsRouter } = require("./routes/posts.routes");
const { commentsRoute } = require("./routes/comments.routes");

// error controller

const { globalErrorHandle } = require("./controllers/error.controller");

const app = express();

// add security header

app.use(helmet());

//compress the response

app.use(compression());

// enable express to receive data

app.use(express.json());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
else if (process.env.NODE_ENV === "production") app.use(morgan("combined"));

// Define endpoints
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRoute);

//global error handler

app.use(globalErrorHandle);

app.all("*", (req, res) => {
  const { method, url } = req;
  res.status(404).json({
    status: "error",
    data: {
      message: `${method} ${url} does not exist on our server`,
    },
  });
});

module.exports = { app };
