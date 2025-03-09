import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

AWS.config.update({
  credentials: {
    accessKeyId: process.env.ACCESSKEYID!,
    secretAccessKey: process.env.SCERTKEYID!,
  },
  region: 'ap-south-1',
});

const ses = new AWS.SES();

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();
    if (!data) {
      return NextResponse.json({ message: 'Empty request' }, { status: 404 });
    }
    const params = {
      Destination: {
        ToAddresses: [data.destination],
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `${data.body}`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: data.subject,
        },
      },
      Source: 'letscode@lets-code.co.in',
    };
    const info = await ses.sendEmail(params).promise();
    console.log('Email sent successfully:', info);
    return NextResponse.json({ message: 'sended' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
};
