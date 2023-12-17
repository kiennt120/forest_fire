const { Fire } = require('../models/index');
const op = require('sequelize').Op;
class FireListController {
    // [GET] /fire-list/show
    async show(req, res, next) {
        try {
            const fire = await Fire.findAll();
            return res.status(200).json({
                status: true,
                fire: fire,
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                fire: [],
                description: 'Fire is not found',
            });
        }
    }

    // [GET] /fire-list/show/:id
    async showOne(req, res, next) {
        try {
            const fire = await Fire.findOne({
                where: {
                    id: req.params.id,
                },
            });
            if (!fire) {
                return res.status(200).json({
                    status: false,
                    fire: [],
                    description: 'Fire is not found',
                });
            }
            return res.status(200).json({
                status: true,
                fire: fire,
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                fire: [],
                description: 'Fire is not found',
            });
        }
    }

    // [GET] /fire-list/search?q=&from=&to=
    async search(req, res, next) {
        const fire = await Fire.findAll({
            where: {
                [op.and]: [
                    { address: { [op.like]: `%${req.query.q}%` } },
                    {
                        updatedAt: {
                            [op.between]: [req.query.from, req.query.to],
                        },
                    },
                ],
            },
        });
        return res.status(200).json({
            status: true,
            fire: fire,
        });
    }

    // [GET] /fire-list/searchByTime?from=&to=
    async searchByTime(req, res, next) {
        const fire = await Fire.findAll({
            where: {
                updatedAt: {
                    [op.between]: [req.query.from, req.query.to],
                },
            },
        });
        return res.status(200).json({
            status: true,
            fire: fire,
        });
    }
}

module.exports = new FireListController();
