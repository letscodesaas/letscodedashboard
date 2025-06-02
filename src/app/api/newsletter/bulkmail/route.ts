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
    const mails = [
      'avinash201199@gmail.com',
      'avinashsingh201199@gmail.com',
      'avinashsingh991102@gmail.com',
      'spl.sp999@gmail.com',
      'ni@jk.com',
      'plk@plk.com',
    ];
    if (!data) {
      return NextResponse.json({ message: 'Empty request' }, { status: 404 });
    }

    const queue = QueueInstance('bulkmail');
    for (let i = 0; i < mails.length; i += 1) {
      await queue.add(
        'bulk-email',
        {
          emails: mails[i],
        },
        {
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
        }
      );
    }
    const sendBulkEmail = async (emails: string) => {
      try {
        const params = {
          Destination: {
            ToAddresses: [emails],
          },
          Message: {
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: data.template,
              },
            },
            Subject: {
              Charset: 'UTF-8',
              Data: data.subject,
            },
          },
          Source: 'letscode@lets-code.co.in',
        };

        await ses.sendEmail(params).promise();
      } catch (error) {
        console.error('SES Error:', error);
        throw error;
      }
    };
    WorkerInstance(
      'bulkmail',
      async (jobs) => {
        try {
          await sendBulkEmail(jobs.data.emails);
        } catch (error) {
          console.log('Retrying failed emails...');
          throw error;
        }
        return () => {};
      },
      {
        concurrency: 10,
      }
    );

    WorkerInstance(
      'bulkmail',
      async (jobs) => {
        try {
          await sendBulkEmail(jobs.data.emails);
        } catch (error) {
          console.log('Retrying failed emails...');
          throw error;
        }
        return () => {};
      },
      {
        concurrency: 10,
      }
    );

    WorkerInstance(
      'bulkmail',
      async (jobs) => {
        // console.log(jobs.data.emails)
        try {
          await sendBulkEmail(jobs.data.emails);
        } catch (error) {
          console.log('Retrying failed emails...');
          throw error;
        }
        return () => {};
      },
      {
        concurrency: 10,
      }
    );

    return NextResponse.json({ message: 'sended' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
};
