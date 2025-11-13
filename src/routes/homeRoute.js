const {Router} = require('express');
const homeRoute = Router();

homeRoute.get('/', (req, res) => {
    res.render('home')
})
module.exports = homeRoute;