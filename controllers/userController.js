const User = require('../models/User');

class UserController {
    async show(req, res) {
        const users = await User.findAll();
        res.json(users);
    }
}

module.exports = new UserController;