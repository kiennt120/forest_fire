const { Supervisor, Credential, Admin } = require('../models/index');
const { registerValidator } = require('../validations/auth');
const bcrypt = require('bcrypt');
const op = require('sequelize').Op;

class UserController {
    // [POST] /user/create
    async createAccount(req, res, next) {
        if (req.body.role === 'admin') {
            const { error } = registerValidator({ email: req.body.email, password: req.body.password });
            if (error) return res.status(422).send(error.details[0].message);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const [user, created] = await Credential.findOrCreate({
                where: {
                    email: req.body.email,
                },
                defaults: {
                    password: hashedPassword,
                    role: req.body.role,
                },
            });
            if (!created) {
                return res.status(422).json({
                    status: false,
                    message: 'User is already exist',
                });
            }
            try {
                await Admin.create({
                    name: req.body.name,
                    email: req.body.email,
                });
                return res.status(201).json({
                    status: true,
                    message: 'Create account successfully',
                });
            } catch (err) {
                await Credential.destroy({
                    where: {
                        email: req.body.email,
                    },
                });
                return res.status(400).json({ status: false, message: err });
            }
        } else if (req.body.role === 'user') {
            const { error } = registerValidator({ email: req.body.email, password: req.body.password });
            if (error) return res.status(422).send(error.details[0].message);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const [user, created] = await Credential.findOrCreate({
                where: {
                    email: req.body.email,
                },
                defaults: {
                    password: hashedPassword,
                    role: req.body.role,
                },
            });
            if (!created) {
                return res.status(422).json({
                    status: false,
                    message: 'User is already exist',
                });
            }
            try {
                await Supervisor.create({
                    name: req.body.name,
                    mSName: req.body.mSName,
                    email: req.body.email,
                    phone: req.body.phone,
                    birthday: req.body.birthday,
                });
                return res.status(201).json({
                    status: true,
                    message: 'Create account successfully',
                });
            } catch (err) {
                await Credential.destroy({
                    where: {
                        email: req.body.email,
                    },
                });
                return res.status(400).json({ status: false, message: err });
            }
        }
    }

    // [GET] /user/show
    async show(req, res, next) {
        const user = await Supervisor.findAll();
        return res.status(200).json({ status: true, user });
    }

    // [GET] /user/show/:email
    async showOne(req, res, next) {
        let user = await Supervisor.findOne({
            where: {
                email: req.params.email,
            },
        });
        if (!user) {
            user = await Admin.findOne({
                where: {
                    email: req.params.email,
                },
            });
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: 'User is not found',
                });
            }
        }
        return res.status(200).json({ status: true, user });
    }

    // [GET] /user/edit/:id
    edit(req, res, next) {
        res.send('edit user');
    }

    // [PUT] /user/update/:email
    async update(req, res, next) {
        try {
            if (req.body.email !== req.params.email) {
                await Credential.update(
                    {
                        email: req.body.email,
                    },
                    {
                        where: {
                            email: req.params.email,
                        },
                    },
                );
            }
            const user = await Supervisor.update(req.body, {
                where: {
                    email: req.body.email,
                },
            });
            return res.status(200).json({ status: true, message: 'Update successfully' });
        } catch (err) {
            return res.status(401).json({ status: false, message: 'Cannot update this account' });
        }
    }

    // [DELETE] /user/delete/:email
    async delete(req, res, next) {
        try {
            console.log(req.params.email);
            await Credential.destroy({
                where: {
                    email: req.params.email,
                },
            });
            return res.status(200).json({ status: true, message: 'Delete successfully' });
        } catch (err) {
            return res.status(401).json({ status: false, message: 'Cannot delete this account' });
        }
    }

    // [GET] /user/search?q=
    async search(req, res, next) {
        const user = await Supervisor.findAll({
            where: {
                [op.or]: [
                    { name: { [op.like]: `%${req.query.q}%` } },
                    { mSName: { [op.like]: `%${req.query.q}%` } },
                    { email: { [op.like]: `%${req.query.q}%` } },
                    { phone: { [op.like]: `%${req.query.q}%` } },
                ],
            },
        });
        return res.status(200).json({ status: true, user });
    }
}

module.exports = new UserController();
