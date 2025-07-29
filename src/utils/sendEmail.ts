import { ses } from '../config/aws';

interface SendEmailParams {
  destinationMail: string;
  subject: string;
  htmlBody: string;
}

const isValidEmail = (email: string): boolean => {
  const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EmailRegex.test(email);
};

export const sendEmail = async ({
  destinationMail,
  subject,
  htmlBody,
}: SendEmailParams) => {
  if (!destinationMail || !subject || !htmlBody) {
    throw new Error('Destination email, subject, and HTML body are required');
  }

  if (!isValidEmail(destinationMail)) {
    throw new Error('Invalid email address format');
  }

  const params = {
    Destination: {
      ToAddresses: [destinationMail],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: 'letscode@lets-code.co.in',
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
