const express = require('express');
const router = express.Router();

const { home_get } = require('../controllers/homeController');

router.get('/', home_get);

module.exports = router;
