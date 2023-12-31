var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');

router.post('/login', authController.login);
router.patch('/update-password', authController.protect, authController.updatePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authController.logout);
router.get('/check-token', authController.checkToken);

module.exports = router;
