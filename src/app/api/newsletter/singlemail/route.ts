import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { WorkerInstance, QueueInstance } from '@/utils/queue';

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
    const queue = QueueInstance('singlemail');
    await queue.add('data', { data }, { removeOnComplete: true });
    WorkerInstance('singlemail', async (jobs) => {
      const params = {
        Destination: {
          ToAddresses: [jobs.data.data.destination],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: jobs.data.data.body,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: jobs.data.data.subject,
          },
        },
        Source: 'letscode@lets-code.co.in',
      };
      await ses.sendEmail(params).promise();
      return () => {};
    },{
      concurrency:3
    });
    return NextResponse.json({ message: 'sended' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
};
