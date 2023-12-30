const { Fire } = require('../models/index');
const op = require('sequelize').Op;
const moment = require('moment');

class FireListController {
    // [POST] /fire-list/create
    async create(req, res, next) {
        try {
            const mysql = require('mysql2/promise');
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '123456',
                database: 'forest_fire',
            });

            const results = await connection.execute(
                `select city, district, ward from monitoring_station where name = (select mSName from camera where cameraId = ${req.body.cameraId})`,
            );
            const ward = results[0][0].ward;
            const district = results[0][0].district;
            const city = results[0][0].city;
            console.log(ward, district, city);
            const fire = await Fire.create({
                cameraId: req.body.cameraId,
                type_fire: req.body.type_fire,
                status: req.body.status,
                ward,
                district,
                city,
                image: req.body.image,
                address: `${ward}, ${district}, ${city}`,
            });
            return res.status(201).json({
                status: true,
                description: 'Create fire successfully',
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                description: 'Failed to create fire',
            });
        }
    }

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
                    fireId: req.params.id,
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

    // [GET] /fire-list/fireTo
    async fireTo(req, res, next) {
        const fire = await Fire.findAll({
            where: {
                [op.and]: [
                    {
                        updatedAt: {
                            [op.gte]: moment().subtract(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                        },
                    },
                    { status: 0 },
                ],
            },
        });
        return res.status(200).json({
            status: true,
            fire: fire,
        });
    }

    // [DELETE] /fire-list/delete/:id
    async delete(req, res, next) {
        try {
            const fire = await Fire.destroy({
                where: {
                    fireId: req.params.id,
                },
            });
            if (!fire) {
                return res.status(400).json({
                    status: false,
                    description: 'Fire is not exist',
                });
            }
            return res.status(200).json({
                status: true,
                description: 'Delete fire successfully',
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                description: 'Failed to delete fire',
            });
        }
    }

    // [PUT] /fire-list/update/:id
    async update(req, res, next) {
        try {
            const fire = await Fire.update(req.body, {
                where: {
                    fireId: req.params.id,
                },
            });
            if (!fire) {
                return res.status(400).json({
                    status: false,
                    description: 'Fire is not exist',
                });
            }
            return res.status(200).json({
                status: true,
                description: 'Update fire successfully',
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                description: 'Failed to update fire',
            });
        }
    }
}

module.exports = new FireListController();
