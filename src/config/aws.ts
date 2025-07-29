import AWS from 'aws-sdk';

AWS.config.update({
  credentials: {
    accessKeyId: process.env.ACCESSKEYID!,
    secretAccessKey: process.env.SCERTKEYID!,
  },
  region: 'ap-south-1',
});

export const ses = new AWS.SES();
