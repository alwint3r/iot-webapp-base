'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConfigurationSchema = new Schema({
    host: String,
    port: Number,
    username: String,
    password: String,
    data_topic: String,
    control_topic: String,
    client_id: String,
    last_updated: {
        type: Date,
        default: Date.now,
    },
    created_date: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

module.exports = mongoose.model('Configuration', ConfigurationSchema);
