const express = require('express');
const { create } = require('../controller/user.controller');
const router = express.Router();

router.route('/users').post(create);

module.exports = router;