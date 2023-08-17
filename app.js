require('./utils/config');
const express = require('express');
const app = express();
const blogRouter = require('./controllers/blog');
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const morgan = require('morgan');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');
const config = require('./utils/config');
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(express.json());
app.use(morgan('dev'));
app.use(middleware.tokenExtracter);
app.use('/api/blogs', middleware.userExtractor, blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
if ((process.env.NODE_ENV = 'test')) {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
