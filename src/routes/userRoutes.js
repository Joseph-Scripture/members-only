const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

// router.post('/signup', authController.signup_post);

// POST /auth/login
router.post('/login', authController.login_post);

// GET /auth/logout
router.get('/logout', authController.logout_get);

router.get('/signup', (req, res) =>{
    res.render('signup', {error: null})
});
router.get('/login', (req, res) => {
    res.render('login')
})

module.exports = router;
