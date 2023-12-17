const { MS } = require('../models/index');
const op = require('sequelize').Op;
const slugify = require('slugify');

class MSController {
    // [POST] /monitoring-station/show
    async show(req, res, next) {
        try {
            const page = req.body.page || 1;
            const limit = req.body.limit || 10;

            const options = {
                page: page,
                limit: limit,
            };
            const ms = await MS.findAll({ options });
            if (ms.length == 0) {
                return res.status(404).json({
                    status: true,
                    description: "Isn't exist any monitoring station",
                });
            }
            res.status(200).json({
                status: true,
                ms: ms,
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                description: 'Monitoring station is not found',
            });
        }
    }

    // [GET] /monitoring-station/:slug
    async showOne(req, res, next) {
        try {
            const ms = await MS.findOne({
                where: {
                    slug: req.params.slug,
                },
            });
            if (!ms) {
                return res.status(404).json({
                    status: false,
                    description: 'Monitoring station is not found',
                });
            }
            res.status(200).json({
                status: true,
                ms: ms,
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                description: 'Monitoring station is not found',
            });
        }
    }

    // [POST] /monitoring-station/create
    async create(req, res, next) {
        const [ms, created] = await MS.findOrCreate({
            where: {
                name: req.body.name,
            },
            defaults: {
                area: req.body.area,
                city: req.body.city,
                district: req.body.district,
                ward: req.body.ward,
                leader: req.body.leader,
                phone: req.body.phone,
                slug: slugify(req.body.name, { lower: true, strict: true }),
            },
        });
        if (!created) {
            return res.status(422).json({
                status: false,
                description: 'Monitoring station is already exist',
            });
        } else {
            return res.status(201).json({
                status: true,
                description: 'Create monitoring station successfully',
                ms: ms,
            });
        }
    }

    // [PUT] /monitoring-station/update/:slug
    async update(req, res, next) {
        try {
            if (req.body.name) {
                req.body.slug = slugify(req.body.name, { lower: true, strict: true });
            }
            console.log(req.body);
            console.log(req.params.slug);
            const ms = await MS.update(req.body, {
                where: {
                    slug: req.params.slug,
                },
            });
            console.log(ms);
            if (!ms[0]) {
                return res.status(400).json({
                    status: false,
                    description: 'Update failed',
                });
            }
            return res.status(200).json({
                status: true,
                description: 'Update successfully',
                ms: ms,
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                description: 'Update failed',
                error: err,
            });
        }
    }

    // [POST] /monitoring-station/search
    async search(req, res, next) {
        const page = req.body.page || 1;
        const limit = req.body.limit || 10;

        const options = {
            page: page,
            limit: limit,
        };
        const ms = await MS.findAll({
            where: {
                [op.or]: [{ name: { [op.like]: `%${req.query.q}%` } }, { area: { [op.like]: `%${req.query.q}%` } }],
            },
            options,
        });
        if (ms.length == 0) {
            return res.status(404).json({
                status: false,
                description: 'Monitoring station is not found',
            });
        }
        return res.status(200).json({
            status: true,
            ms: ms,
        });
    }

    // [DELETE] /monitoring-station/delete/:slug
    async delete(req, res, next) {
        try {
            const ms = await MS.destroy({
                where: {
                    slug: req.params.slug,
                },
            });
            if (!ms) {
                return res.status(400).json({
                    status: false,
                    description: 'Monitoring station is not exist',
                });
            }
            res.status(200).json({
                status: true,
                description: 'Delete successfully',
                ms: null,
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                description: 'Delete failed',
            });
        }
    }
}

module.exports = new MSController();
