'use strict';

const express = require('express');
const router = express.Router();

const Device = require('../middlewares/Device');
const Index = require('../middlewares/Index');

router.get('/', Index.index);
router.post('/configuration', Index.updateConfig);

router.get('/devices', Device.list);

module.exports = router;
