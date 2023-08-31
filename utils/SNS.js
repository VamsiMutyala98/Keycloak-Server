const AWS = require('aws-sdk');
const smsController = require('../controller/sms.controller');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

let cronJob;

exports.SNSServices = (type, data) => {
  return new Promise(async (resolve, reject) => {
    const sns = new AWS.SNS();
    switch(type) {
      case "SENDING_OTP_PHONE_NUMBER_VERIFICATION": {
        const params = {
          PhoneNumber: `+91${data.phoneNumber}`,
        };
        console.log(params);
        sns.createSMSSandboxPhoneNumber(params, function(err, pData) {
          if (err) {
            return reject({
              status: 400,
              message: 'Failed to generate otp to create sandbox phone number'
            });
          }
          console
          if (pData?.ResponseMetadata?.RequestId) {
            return resolve({
              status: 200,
              message: 'OTP generated successfully for sanbox phone number verification',
              data: pData,
            });
          }
          return reject({
            status: 400,
            message: 'Failed to generate otp to create sandbox phone number'
          });
        });
        break;
      }
      case "VERIFY_SMS_SANDBOX_PHONE_NUMBER": {
        const params = {
          PhoneNumber: `+91${data.phoneNumber}`,
          OneTimePassword: data.oneTimePassword,
        };
        sns.verifySMSSandboxPhoneNumber(params, function (err, pData) {
          if (err) {
            return reject({
              status: 400,
              message: 'Failed to verify sandbox the phone number'
            });
          }
          if (pData?.ResponseMetadata?.RequestId) {
            return resolve({
              status: 200,
              message: 'OTP verfied successfully',
              data: pData,
            });
          }
          return reject({
            status: 400,
            message: 'Failed to verify sandbox the phone number'
          });
        });
        break;
      }
      case "GENERATING_SMS": {
        clearTimeout(cronJob);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const params = {
          Message: `Your OTP is: ${otp}`,
          PhoneNumber: `+91${data.phoneNumber}`,
        }
        try {
          const smsDataByPhoneNumber = await smsController.getDataByPhoneNumber(data.phoneNumber);
          if (smsDataByPhoneNumber?.status === 200) {
            await smsController.updateOTPByPhoneNumber({ phoneNumber: data.phoneNumber, otp, isExpired: false});
            cronJob = setTimeout(async () => {
              await smsController.updateOTPByPhoneNumber({ phoneNumber: data.phoneNumber, otp , isExpired: true });
            }, 5 * 10 * 1000);
          } else {
            await smsController.create({ phoneNumber: data.phoneNumber, otp });
            cronJob = setTimeout(async () => {
              await smsController.updateOTPByPhoneNumber({ phoneNumber: data.phoneNumber, otp , isExpired: true });
            }, 5 * 10 * 1000);
          }
        } catch (error) {
          return reject({
            status: 400,
            message: 'Failed to update sms database',
            error,
          })
        }
        sns.publish(params, (err, data) => {
          if (err) {
            return reject({
              status: 400,
              message: 'Failed to generate OTP'
            });
          }
          if (data?.ResponseMetadata?.RequestId && data?.MessageId) {
            return resolve({
              status: 200,
              message: 'OTP generated successfully for phone number',
              data,
            });
          }
          return reject({
            status: 400,
            message: 'Failed to generate OTP'
          });
        })
        break;
      }
      case "VERIFYING_OTP": {
        const smsDataByNumber = await smsController.getDataByPhoneNumber(data.phoneNumber);
        if (smsDataByNumber?.data?.otp === data.otp && !smsDataByNumber?.data?.isExpired) {
          return resolve({
            status: 200,
            message: 'OTP Verified Successfully',
          });
        } else if (smsDataByNumber?.data?.isExpired) {
          return reject({
            status: 400,
            message: 'OTP Expired',
          });
        }
        return reject({
          status: 400,
          message: 'Wrong OTP',
        });
        break;
      }
    }
  });
}