const blogRouter = require("express").Router();
const Blog = require("../model/blog");
const logger = require("../utils/logger");
blogRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({});
    response.status(200).json(blogs);
  } catch (error) {
    logger.error(error);
  }
});

blogRouter.post("/", async (request, response) => {
  try {
    const blog = new Blog(request.body);
    if (!blog.likes) blog.likes = 0;
    if (!blog.title || !blog["url"]) response.status(400).end();
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    logger.error(error);
  }
});

module.exports = blogRouter;
