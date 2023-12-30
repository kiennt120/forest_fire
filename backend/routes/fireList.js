var express = require('express');
var router = express.Router();
var fireListController = require('../controllers/fireListController');

router.post('/create', fireListController.create);
router.get('/search', fireListController.search);
router.get('/searchByTime', fireListController.searchByTime);
router.get('/fireTo', fireListController.fireTo);
router.get('/show/:id', fireListController.showOne);
router.delete('/delete/:id', fireListController.delete);
router.put('/update/:id', fireListController.update);
router.get('/show', fireListController.show);

module.exports = router;
