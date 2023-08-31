const express = require('express');
const router = express.Router();
const employeeRoutes = require('./employee');
const projectRoutes = require('./project');
const constantRoutes = require('./constant');
const loginRoutes = require('./login');
const smsRoutes = require('./sms');

router.use('/v1', employeeRoutes);
router.use('/v1', projectRoutes);
router.use('/v1',  constantRoutes);
router.use('/v1/auth', loginRoutes);
router.use('/v1', smsRoutes);


module.exports = router;