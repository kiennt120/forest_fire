var userRouter = require('./user');
var mSRouter = require('./mS');
var fireListRouter = require('./fireList');
var authRouter = require('./auth');
var cameraRouter = require('./camera');
var authController = require('../controllers/authController');
const express = require('express');
const cors = require('cors');

function route(app) {
    // app.use(express.json());
    app.use(cors());
    app.use('/api/user', authController.protect, authController.restrict('admin'), userRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/monitoring-station', authController.protect, authController.restrict('admin'), mSRouter);
    app.use('/api/camera', authController.protect, authController.restrict('admin'), cameraRouter);
    app.use('/api/fire-list', fireListRouter);
}

module.exports = route;
