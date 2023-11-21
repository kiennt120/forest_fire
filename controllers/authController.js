const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation} = require('../validations/auth');

class AuthController {
    // [POST] /auth/login
    async login(req, res) {
        // find user
        // const user
        if (!user) { // user not found
            return res.status(422).json({
                message: 'Email or password is incorrect'
            });
        }
        // compare password
        const checkPassword = await bcrypt.compare(req.body.password, user.password);
        if (!checkPassword) { // password incorrect
            return res.status(422).json({
                message: 'Email or password is incorrect'
            });
        }
        const token = jwt.sign({
            _id: user.id,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
    }
}

module.exports = new AuthController;