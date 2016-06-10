'use strict';

const mongoose = require('mongoose');
require('../models/ConfigurationModel');
const Configuration = mongoose.model('Configuration');

module.exports = {
    index(req, res, next) {
        Configuration.findOne({}, (err, config) => {
            if (err) {
                return next(err);
            }

            const model = {
                config,
            };

            return res.render('index.html', model);
        });
    },

    updateConfig(req, res, next) {
        Configuration.find({}, (err, configs) => {
            if (err) {
                return next(err);
            }

            if (!configs) {
                return Configuration.insert(req.body, err => {
                    if (err) {
                        return next(err);
                    }

                    req.flash('success', 'Configuration is updated');

                    return res.redirect('/');
                });
            }

            const config = configs.pop();

            return Configuration.findOneAndUpdate({ _id: config.id }, req.body, err => {
                if (err) {
                    return next(err);
                }

                req.flash('success', 'Configuration is updated');

                return res.redirect('/');
            });
        });
    },
};
