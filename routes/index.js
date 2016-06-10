'use strict';

const express = require('express');
const router = express.Router();

const Device = require('../middlewares/Device');

router.get('/', (req, res, next) => {
    return res.render('index.html', { name: 'winter' });
});

router.get('/devices', Device.list);

module.exports = router;
