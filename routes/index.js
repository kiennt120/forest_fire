var express = require('express');
var router = express.Router();
var userRouter = require('./users');
var fireListRouter = require('./fireList');
var authRouter = require('./auth');

function route(app) {
  app.use('/user', userRouter);
  app.use('/auth', authRouter);
  // app.use('/', fireListRouter);
}

module.exports = route;
