const express = require('express');
const { create, getAllConstantData, getConstantDataByType, update } = require('../controller/constant.controller');
const { auth } = require('../utils/helper');
const router = express.Router();

router.route('/constant').post(auth, create).get(auth, getAllConstantData).get(auth, getConstantDataByType).put(auth, update);

module.exports = router;