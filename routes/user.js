var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.post('/create', userController.createAccount);
router.get('/show', userController.show);
router.get('/show/:id', userController.showOne);
router.get('/search', userController.search);
router.get('/', userController.show);

module.exports = router;
