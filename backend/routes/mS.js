const express = require('express');
const router = express.Router();
const mSController = require('../controllers/mSController');

router.post('/create', mSController.create);
router.get('/show/:slug', mSController.showOne);
router.put('/update/:slug', mSController.update);
router.delete('/delete/:slug', mSController.delete);
router.post('/search', mSController.search);
router.post('/show', mSController.show);

module.exports = router;
