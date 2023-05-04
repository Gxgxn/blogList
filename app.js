require("./utils/config");
const express = require("express");
const app = express();
const blogRouter = require("./controllers/blog");
const userRouter = require("./controllers/user");
const morgan = require("morgan");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");
const config = require("./utils/config");
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());
app.use(morgan("tiny"));
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
