'use strict';

const mongoose = require('mongoose');
require('../models/DeviceModel');
const DeviceModel = mongoose.model('Device');

module.exports = {
    list(req, res, next) {
        DeviceModel.find({}, (err, data) => {
            if (err) {
                return next(err);
            }

            return res.json({
                meta: {
                    code: 200,
                    message: 'Device data',
                },
                data: data,
            });
        });
    },
};
