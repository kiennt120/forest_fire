var userRouter = require('./user');
var mSRouter = require('./mS');
// var fireListRouter = require('./fireList');
var authRouter = require('./auth');
var cameraRouter = require('./camera');
var authController = require('../controllers/authController');

function route(app) {
  app.use('/user', authController.protect, authController.restrict('admin'), userRouter);
  app.use('/auth', authRouter);
  app.use('/monitoring-station', authController.protect, authController.restrict('admin'), mSRouter)
  app.use('/camera', authController.protect, authController.restrict('admin'), cameraRouter);
  // app.use('/', fireListRouter);
}

module.exports = route;
