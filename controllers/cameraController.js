const { Camera } = require('../models/index');
const op = require('sequelize').Op;
const slugify = require('slugify');

class CameraController {

    // [GET] /camera/create
    create(req, res, next) {
        // res.render('camera/create');
    }

    // [POST] /camera/store
    async store(req, res, next) {
        try {
            console.log(req.body);
            const [camera, created] = await Camera.findOrCreate({
                where: {
                    ip: req.body.ip
                },
                defaults: {
                    mSName: req.body.mSName,
                    coordinate: req.body.coordinate,
                    info: req.body.infor,
                    status: req.body.status,
                }
            });
            if (!created) {
                return res.status(422).json({
                    message: 'Camera is already exist'
                });
            };
            return res.status(201).json({
                message: 'Create camera successfully'
            });
        }
        catch (err) {
            return res.json({
                message: err
            });
        };
    }

    // [GET] /camera/show/
    async show(req, res, next) {
        try {
            const cameras = await Camera.findAll();
            return res.status(200).json({
                cameras: cameras
            });
        }
        catch (err) {
            return res.status(404).json({
                message: err
            });
        };
    }

    // [GET] /camera/show/:id
    async showOne(req, res, next) {
        try {
            const camera = await Camera.findOne({
                where: {
                    cameraId: req.params.id
                }
            });
            return res.status(200).json({
                camera: camera
            });
        }
        catch (err) {
            return res.status(404).json({
                message: err
            });
        };
    }

    // [GET] /camera/edit/:id
    edit(req, res, next) {
        // res.send('edit camera');
    }

    // [PUT] /camera/update-info/:id
    async updateInfo(req, res, next) {
        try {
            await Camera.update(req.body, {
                where: {
                    cameraId: req.params.id
                }
            });
            return res.status(200).json({
                message: 'Update successfully'
            });
        }
        catch (err) {
            return res.status(400).json({
                message: err
            });
        };
    }

    // [PUT] /camera/update-status/:id
    async updateStatus(req, res, next) {
        try {
            await Camera.update(req.body.status, {
                where: {
                    cameraId: req.params.id
                }
            });
            return res.status(200).json({
                message: 'Update successfully'
            });
        }
        catch (err) {
            return res.status(400).json({
                message: err
            });
        };
    }

    // [DELETE] /camera/delete/:id
    async delete(req, res, next) {
        try {
            await Camera.destroy({
                where: {
                    cameraId: req.params.id
                }
            });
            return res.status(200).json({
                message: 'Delete successfully'
            });
        }
        catch (err) {
            return res.status(400).json({
                message: err
            });
        };
    }
}

module.exports = new CameraController;