import AWS from 'aws-sdk';

if (process.env.ACCESSKEYID && process.env.SCERTKEYID) {
  AWS.config.update({
    credentials: {
      accessKeyId: process.env.ACCESSKEYID!,
      secretAccessKey: process.env.SCERTKEYID!,
    },
    region: 'ap-south-1',
  });
  console.log('\n\nAWS SDK configured with provided credentials');
} else {
  console.error('AWS credentials are not set in environment variables');
  throw new Error('AWS credentials are required for SES configuration');
}
export const ses = new AWS.SES();
