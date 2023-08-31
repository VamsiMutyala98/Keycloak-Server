const SMS = require('../model/sms');
const SNS = require('../utils/SNS');

exports.create = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data);
      const sms = await SMS.create(data);
      if (sms) {
        return resolve({
          status: 200,
          message: 'SMS created successfully'
        });
      }
      return reject({
        status: 400,
        message: 'Failed to update SMS',
      });
    } catch (error) {
      return reject({
        status: 400,
        message: 'Failed to create SMS',
      });
    }
  });
}

exports.updateOTPByPhoneNumber = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sms = await SMS.findOneAndUpdate({ phoneNumber: data.phoneNumber }, { $set: { ...data } }, { new: true, runValidators: true}).lean();
      if (sms) {
        return resolve({
          status: 200,
          message: 'SMS updated successfully'
        })
      }
      return reject({
        status: 400,
        message: 'Failed to update SMS',
      })
    } catch (error) {
      return reject({
        status: 400,
        message: 'Failed to update SMS',
      })
    }
  })
}

exports.getDataByPhoneNumber = (phoneNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sms = await SMS.findOne({ phoneNumber }).lean();
      if (sms) {
        return resolve({
          status: 200,
          message: 'Phone number fetched successfully',
          data: sms,
        })
      }
      return resolve({
        status: 400,
        message: 'Failed to fetch phone number',
      })
    } catch (error) {
      return reject({
        status: 400,
        message: 'Failed to fetch phone number',
      })
    }
  })
}

exports.sandboxPhoneNumberOtpGenerator = (req, res) => {
  SNS.SNSServices('SENDING_OTP_PHONE_NUMBER_VERIFICATION', { ...req.body }).then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(400).json(error);
  });
}

exports.sanboxPhoneNumberVerification = (req, res) => {
  SNS.SNSServices('VERIFY_SMS_SANDBOX_PHONE_NUMBER', { ...req.body }).then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(400).json(error);
  });
}

exports.sendingOtp = (req, res) => {
  SNS.SNSServices('GENERATING_SMS', { ...req.body }).then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(400).json(error);
  });
}

exports.verifyOtp = (req, res) => {
  SNS.SNSServices('VERIFYING_OTP', { ...req.body }).then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(400).json(error);
  });
}
