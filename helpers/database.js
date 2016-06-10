'use strict';

const mongoose = require('mongoose');
const config = require('../config');

module.exports = function (done) {
    (function () {
        const options = {
            server: {
                socketOptions : {
                    keepAlive: 1,
                },
            },
        };

        if (config.mongodb.username && config.mongodb.password) {
            options.user = config.mongodb.username;
            option.pass = config.mongodb.password;
        }

        mongoose.connect(config.mongodb.connectionUri, options);
    }());

    mongoose.connection.on('error', err => {
        console.error('Error on connecting to mongodb server. Details:', err);

        return done(err);
    });

    process.on('SIGINT', () =>
        mongoose.connection.close(() => process.exit(0))
    );

    mongoose.connection.on('connected', () => {
        console.log('Mongoose is connected to database server');

        return done(null);
    });
};
