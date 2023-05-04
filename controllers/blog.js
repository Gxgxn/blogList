const blogRouter = require("express").Router();
const Blog = require("../model/blog");
const logger = require("../utils/logger");
const User = require("../model/user");
blogRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user");
    response.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.post("/", async (request, response, next) => {
  try {
    const blog = new Blog(request.body);
    const users = await User.find({});
    const user = users[0];
    console.log(user);
    blog.user = user.id;
    if (!blog.likes) blog.likes = 0;
    if (!blog.title || !blog["url"]) response.status(400).end();
    const result = await blog.save();
    //saves ref of Blog in user
    console.log(user.blogs);
    user.blogs = user.blogs.concat(result._id);
    await user.save();

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

blogRouter.put("/:id", async (request, response, next) => {
  try {
    const blog = request.body;
    if (!blog) throw new Error("Body Missing");
    const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    response.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
