'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
    name: String,
    identifier: {
        type: String,
        required: true,
    },
    created_date: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

module.exports = mongoose.model('Device', DeviceSchema);
