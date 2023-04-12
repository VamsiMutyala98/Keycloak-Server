const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

console.log(process.env.AWS_REGION, process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_KEY)

const AWS_SNS = () => {
  const params = {
    Message: "Hi Praveen",
    PhoneNumber: '+919490807313'
  };
  const sns = new AWS.SNS();
  
  sns.publish(params, (err, data) => {
    if (err) {
      console.log('Error sending message:', err);
    } else {
      console.log('Message sent:', data.MessageId);
    }
  });
}

const message = {
  Message: 'Hello from SNS!',
  TopicArn: 'arn:aws:sns:ap-south-1:913189358932:internal-poc'
};

AWS_SNS();