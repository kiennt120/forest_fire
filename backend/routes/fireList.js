var express = require('express');
var router = express.Router();
var fireListController = require('../controllers/fireListController');

// router.get('/create', fireListController.create);
router.get('/search', fireListController.search);
router.get('/searchByTime', fireListController.searchByTime);
router.get('/show/:id', fireListController.showOne);
router.get('/show', fireListController.show);

module.exports = router;
