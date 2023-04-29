const blogRouter = require("express").Router();
const Blog = require("../model/blog");
const logger = require("../utils/logger");
blogRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.post("/", async (request, response, next) => {
  try {
    const blog = new Blog(request.body);
    if (!blog.likes) blog.likes = 0;
    if (!blog.title || !blog["url"]) response.status(400).end();
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});
blogRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findOneAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
