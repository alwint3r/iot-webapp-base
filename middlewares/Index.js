'use strict';

const mongoose = require('mongoose');
require('../models/ConfigurationModel');
const Configuration = mongoose.model('Configuration');

module.exports = {
    index(req, res, next) {
        Configuration.find({}, (err, config) => {
            if (err) {
                return next(err);
            }

            const model = {
                config: config.pop(),
            };

            return res.render('index.html', model);
        });
    },

    updateConfig(req, res, next) {
        const body = req.body;
        body.last_updated = new Date();

        if (!body.password) {
            delete body.password;
        }

        Configuration.find({}, (err, configs) => {
            if (err) {
                return next(err);
            }

            if (configs.length < 1) {
                return Configuration.create(body, err => {
                    if (err) {
                        return next(err);
                    }

                    req.flash('success', 'Configuration is updated');

                    return res.redirect('/');
                });
            }

            const config = configs.pop();

            return Configuration.findOneAndUpdate({ _id: config._id }, body, err => {
                if (err) {
                    return next(err);
                }

                req.flash('success', 'Configuration is updated');

                return res.redirect('/');
            });
        });
    },
};
