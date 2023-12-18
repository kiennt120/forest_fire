var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.post('/create', userController.createAccount);
router.get('/show', userController.show);
router.get('/show/:email', userController.showOne);
router.get('/search', userController.search);
router.put('/update/:email', userController.update);
router.delete('/delete/:email', userController.delete);
router.get('/', userController.show);

module.exports = router;
