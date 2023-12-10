const { Supervisor, Credential, Admin } = require('../models/index');
const { registerValidator } = require('../validations/auth');
const bcrypt = require('bcrypt');
const op = require('sequelize').Op;


class UserController {

    // [POST] /user/create
    async createAccount(req, res, next) {
        if (req.body.role === 'admin') {
            const { error } = registerValidator({email: req.body.email, password: req.body.password});
            if (error) return res.status(422).send(error.details[0].message);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const [user, created] = await Credential.findOrCreate({
                where: {
                    email: req.body.email
                },
                defaults: {
                    password: hashedPassword,
                    role: req.body.role
                }
            });            
            if (!created) {
                return res.status(422).json({
                    message: 'User is already exist'
                });
            };
            try {
                await Admin.create({
                    name: req.body.name,
                    email: req.body.email,
                });
                return res.status(201).json({
                    message: 'Create account successfully'
                });
            }
            catch (err) {
                await Credential.destroy({
                    where: {
                        email: req.body.email
                    }
                });
                return res.status(400).send(err);
            };
        }

        else if (req.body.role === 'user') {
            const { error } = registerValidator({email: req.body.email, password: req.body.password});
            if (error) return res.status(422).send(error.details[0].message);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const [user, created] = await Credential.findOrCreate({
                where: {
                    email: req.body.email
                },
                defaults: {
                    password: hashedPassword,
                    role: req.body.role
                }
            });            
            if (!created) {
                return res.status(422).json({
                    message: 'User is already exist'
                });
            };
            try {
                await Supervisor.create({
                    name: req.body.name,
                    mSName: req.body.mSName,
                    email: req.body.email,
                });
                return res.status(201).json({
                    message: 'Create account successfully'
                });
            }
            catch (err) {
                await Credential.destroy({
                    where: {
                        email: req.body.email
                    }
                });
                return res.status(400).send(err);
            };
        };
    };

    // [GET] /user/show
    async show(req, res, next) {
        const users = await Supervisor.findAll();
        if (!users[0]) {
            return res.status(404).json({
                message: 'User is not found'
            });
        };
        return res.json(users);
    };

    // [GET] /user/show/:id
    async showOne(req, res, next) {
        const user = await Supervisor.findOne({
            where: {
                userId: req.params.id
            }
        });
        if (!user) {
            return res.status(404).json({
                message: 'User is not found'
            });
        };
        return res.json(user);
    };

    // [GET] /user/edit/:id
    edit(req, res, next) {
        res.send('edit user');
    };

    // [PUT] /user/update/:id
    async update(req, res, next) {
        try {
            await Supervisor.update(req.body, {
                where: {
                    userId: req.params.id
                }
            })
        }
        catch (err) {
            return res.json(err);
        }
    };

    // [DELETE] /user/delete/:email
    async delete(req, res, next) {
        try {
            await Credential.destroy({
                where: {
                    email: req.params.email
                }
            })
        }
        catch (err) {
            return res.json(err);
        }
    };

    // [GET] /user/search?q=
    async search(req, res, next) {
        const users = await Supervisor.findAll({
            where: {
                [op.or]: [
                    { name: { [op.like]: `%${req.query.q}%` } },
                    { mSName: { [op.like]: `%${req.query.q}%` } },
                    { email: { [op.like]: `%${req.query.q}%` } },
                    { phone: { [op.like]: `%${req.query.q}%` } },
                ]
            }
        });
        return res.json(users);
    };
}

module.exports = new UserController;