const express = require('express');
const { sandboxPhoneNumberOtpGenerator, sanboxPhoneNumberVerification, sendingOtp, verifyOtp } = require('../controller/sms.controller');
const router = express.Router();

router.route('/intial-otp-generator').post(sandboxPhoneNumberOtpGenerator);
router.route('/intial-otp-verification').post(sanboxPhoneNumberVerification);
router.route('/sending-otp').post(sendingOtp);
router.route('/verify-otp').post(verifyOtp);

module.exports = router;