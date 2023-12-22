const { Camera } = require('../models/index');
const op = require('sequelize').Op;
const slugify = require('slugify');

class CameraController {
    // [POST] /camera/create
    async create(req, res, next) {
        try {
            console.log(req.body);
            const [camera, created] = await Camera.findOrCreate({
                where: {
                    ip: req.body.ip,
                },
                defaults: {
                    mSName: req.body.mSName,
                    coordinate: req.body.coordinate,
                    info: req.body.infor,
                    status: req.body.status,
                },
            });
            if (!created) {
                return res.status(422).json({
                    status: false,
                    message: 'Camera is already exist',
                });
            }
            return res.status(201).json({
                status: true,
                message: 'Create camera successfully',
            });
        } catch (err) {
            return res.json({
                status: false,
                message: err,
            });
        }
    }

    // [GET] /camera/show/
    async show(req, res, next) {
        try {
            const cameras = await Camera.findAll();
            return res.status(200).json({
                status: true,
                cameras: cameras,
            });
        } catch (err) {
            return res.status(404).json({
                status: false,
                message: err,
            });
        }
    }

    // [GET] /camera/show/:id
    async showOne(req, res, next) {
        try {
            const camera = await Camera.findOne({
                where: {
                    cameraId: req.params.id,
                },
            });
            return res.status(200).json({
                status: true,
                camera: camera,
            });
        } catch (err) {
            return res.status(404).json({
                status: false,
                message: err,
            });
        }
    }

    // [GET] /camera/edit/:id
    edit(req, res, next) {
        // res.send('edit camera');
    }

    // [PUT] /camera/update/:id
    async update(req, res, next) {
        try {
            const updated = await Camera.update(req.body, {
                where: {
                    cameraId: req.params.id,
                },
            });
            if (!updated[0]) {
                return res.status(404).json({
                    status: false,
                    message: 'Camera is not found',
                });
            }
            return res.status(200).json({
                status: true,
                message: 'Update successfully',
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                message: 'Cannot update camera',
            });
        }
    }

    // [PUT] /camera/update-status/:id
    async updateStatus(req, res, next) {
        try {
            console.log(req.body.status);
            console.log(req.params.id);
            const updated = await Camera.update(
                { status: req.body.status },
                {
                    where: {
                        cameraId: req.params.id,
                    },
                },
            );
            console.log(updated);
            if (!updated[0]) {
                return res.status(404).json({
                    status: false,
                    message: 'Camera is not found',
                });
            }
            return res.status(200).json({
                status: true,
                message: 'Update successfully',
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                message: 'Cannot update camera',
            });
        }
    }

    // [DELETE] /camera/delete/:id
    async delete(req, res, next) {
        try {
            await Camera.destroy({
                where: {
                    cameraId: req.params.id,
                },
            });
            return res.status(200).json({
                status: true,
                message: 'Delete successfully',
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err,
            });
        }
    }

    async search(req, res, next) {
        try {
            const cameras = await Camera.findAll({
                where: {
                    [op.or]: [
                        {
                            status: {
                                [op.like]: `${req.query.q}%`,
                            },
                        },
                        {
                            mSName: {
                                [op.like]: `%${req.query.q}%`,
                            },
                        },
                        {
                            ip: {
                                [op.like]: `%${req.query.q}%`,
                            },
                        },
                    ],
                },
            });
            return res.status(200).json({
                status: true,
                cameras: cameras,
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                // message: err,
            });
        }
    }
}

module.exports = new CameraController();
