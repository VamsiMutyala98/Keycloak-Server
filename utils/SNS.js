const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY || 'AKIA5JHSTZVKDFIY3EEI',
  secretAccessKey: process.env.AWS_SECRET_KEY || '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',
  region: process.env.AWS_REGION || 'ap-south-1'
});

console.log(process.env.AWS_REGION, process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_KEY)

const AWS_SNS = () => {
  const params = {
    Message: "Hi Praveen",
    PhoneNumber: '+919490807313'
  };
  const sns = new AWS.SNS();
  
  sns.checkIfPhoneNumberIsOptedOut({
    phoneNumber: '+919490807313'
  }, (err, data) => {
    if (err) {
      console.log('Error getting opt-out status:', err);
    } else {
      console.log(data);
      const optedOut = data.isOptedOut;
  
      if (optedOut) {
        console.log(`Phone number +919490807313 has opted out of receiving SMS messages`);
      } else {
        console.log(`Phone number +919490807313 has not opted out of receiving SMS messages`);
      }
    }
  });
  // sns.publish(params, (err, data) => {
  //   if (err) {
  //     console.log('Error sending message:', err);
  //   } else {
  //     console.log('Message sent:', data.MessageId);
  //   }
  // });
}

const message = {
  Message: 'Hello from SNS!',
  TopicArn: 'arn:aws:sns:ap-south-1:913189358932:internal-poc'
};

AWS_SNS();