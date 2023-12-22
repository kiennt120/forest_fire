const express = require('express');
const router = express.Router();
const cameraController = require('../controllers/cameraController');

router.post('/create', cameraController.create);
router.get('/show', cameraController.show);
router.get('/show/:id', cameraController.showOne);
router.get('/edit/:id', cameraController.edit);
router.put('/update/:id', cameraController.update);
router.put('/update-status/:id', cameraController.updateStatus);
router.get('/search', cameraController.search);
router.delete('/delete/:id', cameraController.delete);

module.exports = router;
