var express = require('express');
var router = express.Router();
var verifyToken = require('../middlewares/verifyToken');
var user = require('../controllers/userController');

/* GET users listing. */
router.get('/', verifyToken, user.show);

module.exports = router;
