const express = require('express'),
router = express.Router(),
user = require('./user.controller')

router.post('/signup', user.signup);
router.post('/signin', user.signin);
router.get('/verify', user.verify);
router.post('/verify', user.verify);

module.exports = router;