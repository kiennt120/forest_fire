const express = require('express');
const router = express.Router();
const mSController = require('../controllers/mSController');

router.get('/create', mSController.create);
router.post('/store', mSController.store);
router.get('/show/:slug', mSController.showOne);
router.get('/edit/:slug', mSController.edit);
router.put('/update/:slug', mSController.update);
router.delete('/delete/:slug', mSController.delete);
router.get('/search', mSController.search);
router.get('/show', mSController.show);

module.exports = router;
