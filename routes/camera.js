const express = require('express');
const router = express.Router();
const cameraController = require('../controllers/cameraController');

router.get('/create', cameraController.create);
router.post('/store', cameraController.store);
router.get('/show', cameraController.show);
router.get('/show/:id', cameraController.showOne);
router.get('/edit/:id', cameraController.edit);
router.put('/update-infor/:id', cameraController.updateInfo);
router.put('/update-status/:id', cameraController.updateStatus);
router.delete('/delete/:id', cameraController.delete);

module.exports = router;