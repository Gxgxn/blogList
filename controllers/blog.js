const blogRouter = require('express').Router();
const Blog = require('../model/blog');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
//moved auth toke
// const getBearerToken = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.startsWith("Bearer ")) {
//     return authorization.replace("Bearer ", "");
//   }
//   return null;
// };
blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user');
    response.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.post('/', async (request, response, next) => {
  try {
    const token = request.token;
    const blog = new Blog(request.body);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
    const user = request.user;
    // const user = await User.findById(decodedToken.id);

    blog.user = user.id;
    if (!blog.author) {
      blog.author = user.name;
    }

    if (!blog.likes) blog.likes = 0;
    if (!blog.title || !blog['url']) return response.status(400).end();
    const result = await blog
      .save()
      .then((t) => t.populate('user', { username: 1, name: 1 }));
    console.log('ran');
    //saves ref of Blog in user
    user.blogs = user.blogs.concat(result._id);
    await user.save();

    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});
blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const token = request.token;

    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const user = request.user;
    // const user = await User.findById(decodedToken.id);
    const blogToDelete = await Blog.findById(request.params.id);
    if (blogToDelete.user.toString() === user._id.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).json({ error: `Unauthorized` });
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.put('/:id', async (request, response, next) => {
  try {
    const blog = request.body;
    if (!blog) throw new Error('Body Missing');
    const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    }).populate('user', { username: 1, name: 1 });
    response.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
