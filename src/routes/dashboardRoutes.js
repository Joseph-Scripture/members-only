const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/auth');
const { dashboard_get } = require('../controllers/dashboardController');

router.get('/', ensureAuthenticated, dashboard_get);

module.exports = router;
