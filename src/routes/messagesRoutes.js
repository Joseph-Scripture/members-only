const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/auth');
const { createMessage } = require('../controllers/messagesController');

router.post('/new', ensureAuthenticated, createMessage);

module.exports = router;
