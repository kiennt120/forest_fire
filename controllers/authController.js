const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { registerValidation} = require('../validations/auth');

class AuthController {

    // [POST] /auth/register
    async register(req, res) {
        const checkUserExist = await User.findOne({
            where: {
                username: req.body.username
            }
        });
        if (checkUserExist) {
            return res.status(422).json({
                message: 'User is already exist'
            });
        };
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const obj = {
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role
        };
        try {
            const user = await User.create(obj)
            res.send('register success')
        }
        catch (err) {
            res.status(400).send(err);
        }
    }

    // [POST] /auth/login
    async login(req, res) {
        // find user
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });
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
            _id: user.userId,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        res.json({
            token: token,
            user: user.role
        });
    }
}

module.exports = new AuthController;