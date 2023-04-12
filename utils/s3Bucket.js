const AWS = require('aws-sdk');
const AppError = require('./AppError');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3();

exports.S3Bucket = async (params) => {
  try {
    console.log(params)
    const data =  await s3.upload(params).promise();
    if (data) {
      console.log(data)
      return data.Location;
    }
  } catch (error) {
    console.log(error)
    return new AppError('Error while uploading in s3 bucket', 500)
  }
}