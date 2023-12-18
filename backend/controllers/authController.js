const { Credential, Supervisor, Admin } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidator } = require('../validations/auth');

// Create token
const signToken = (email, role) => {
    return jwt.sign({ email, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.expiresIn,
    });
};

class AuthController {
    // [POST] /auth/login
    async login(req, res, next) {
        // Check validation of email and password
        const { error } = registerValidator({
            email: req.body.email,
            password: req.body.password,
        });
        if (error)
            return res.status(422).send({
                status: false,
                message: error.details[0].message,
            });

        const user = await Credential.findOne({
            // find user
            where: {
                email: req.body.email,
            },
        });
        if (!user) {
            // user not found
            return res.status(422).json({
                status: false,
                message: 'Email or password is incorrect',
            });
        }
        const checkPassword = await bcrypt.compare(req.body.password, user.password); // compare password
        if (!checkPassword) {
            // password incorrect
            return res.status(422).json({
                status: false,
                message: 'Email or password is incorrect',
            });
        }
        const token = signToken(user.email, user.role);
        res.status(201).json({
            status: true,
            token: token,
            user: user,
            role: user.role,
        });
    }

    // [POST] /auth/logout
    async logout(req, res, next) {}

    // [PATCH] /auth/update-password
    async updatePassword(req, res, next) {
        // Check validation of email and password
        const { error } = registerValidator({
            email: req.body.email,
            password: req.body.new_password,
        });
        if (error) return res.status(422).send(error.details[0].message);
        const account = await Credential.findOne({
            // find user
            where: {
                email: req.body.email,
            },
        });
        if (!account) {
            // user not found
            return res.status(422).json({
                status: false,
                message: 'User not found',
            });
        }

        const checkPassword = await bcrypt.compare(req.body.new_password, account.password); // compare password
        if (checkPassword) {
            return res.status(422).json({
                status: false,
                message: 'Password is not changed',
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.new_password, salt);
        const obj = {
            password: hashedPassword,
        };
        try {
            const user = await Credential.update(obj, {
                // update password
                where: {
                    email: req.body.email,
                },
            });
            console.log(user);
            const token = signToken(user.email, user.role);
            res.status(201).json({
                status: true,
                token,
                user: user,
                role: user.role,
            });
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    async protect(req, res, next) {
        // 1. Read a token & check if it's exist
        let token = req.headers.authorization;
        // console.log(token);
        // let token;
        if (token && token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'You are not logged in! Please log in to get access.',
            });
        }

        // 2. Verification token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                status: false,
                code: 401,
                message: err.message,
            });
        }
        // 3. If user is exits
        let user;

        user = await Credential.findOne({
            where: {
                email: decoded.email,
            },
        });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'The user belonging to this token does no longer exist.',
            });
        }

        // 4. Check if user changed password after the token was issued

        // 5. Allow user to access route
        req.user = user;
        req.user.role = decoded.role;
        next();
    }

    restrict(role) {
        return (req, res, next) => {
            if (req.user.role !== role) {
                return res.status(403).json({
                    code: 403,
                    message: 'You do not have permission to perform this action',
                });
            }
            next();
        };
    }

    // [POST] /auth/forgot-password
    forgotPassword(req, res, next) {}

    // [POST] /auth/reset-password
    resetPassword(req, res, next) {}
}

module.exports = new AuthController();
