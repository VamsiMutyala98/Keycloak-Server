const express = require('express');
const { validateCode, creatingNewUser } = require('../controller/login.controller');
const { auth } = require('../utils/helper');
const router = express.Router();

router.route('/validate').get(validateCode);
router.route('/validate/refresh').get(auth, validateCode);
router.route('/create/user').post(creatingNewUser);

module.exports = router;