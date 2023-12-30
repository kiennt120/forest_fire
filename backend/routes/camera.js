const express = require('express');
const router = express.Router();
const cameraController = require('../controllers/cameraController');
var authController = require('../controllers/authController');

router.post('/create', authController.protect, cameraController.create);
router.get('/show', cameraController.show);
router.get('/show/:id', cameraController.showOne);
router.get('/edit/:id', authController.protect, cameraController.edit);
router.put('/update/:id', authController.protect, cameraController.update);
router.put('/update-status/:id', authController.protect, cameraController.updateStatus);
router.get('/search', cameraController.search);
router.delete('/delete/:id', authController.protect, cameraController.delete);

module.exports = router;
