// src/template/interview.ts
const LetsCodeLogo =
  'https://d3l4smlx4vuygm.cloudfront.net/IMG_20250123_135429_806.webp';
const LetsCodeWebsite = 'https://lets-code.co.in';
const LetsCodeEmail = 'letscode@lets-code.co.in';

// Simplified email styles - minimal and professional
const emailStyles = {
  container: `
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    line-height: 1.5;
    color: #333333;
    background-color: #ffffff;
  `,
  header: `
    background-color: #2563eb;
    padding: 20px;
    text-align: center;
  `,
  logo: `
    max-width: 100px;
    height: auto;
    margin-bottom: 10px;
  `,
  headerTitle: `
    color: #ffffff;
    font-size: 20px;
    font-weight: bold;
    margin: 0;
  `,
  content: `
    background-color: #ffffff;
    padding: 20px;
  `,
  greeting: `
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 15px;
  `,
  paragraph: `
    margin-bottom: 15px;
    color: #4b5563;
    font-size: 14px;
  `,
  button: `
    display: inline-block;
    background-color: #2563eb;
    color: #ffffff;
    padding: 12px 24px;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 600;
    margin: 15px 0;
  `,
  successBox: `
    background-color: #f0fdf4;
    border: 1px solid #22c55e;
    border-radius: 4px;
    padding: 15px;
    margin: 15px 0;
  `,
  errorBox: `
    background-color: #fef2f2;
    border: 1px solid #ef4444;
    border-radius: 4px;
    padding: 15px;
    margin: 15px 0;
  `,
  infoBox: `
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 15px;
    margin: 15px 0;
  `,
  footer: `
    background-color: #f8fafc;
    color: #6b7280;
    padding: 20px;
    text-align: center;
    font-size: 12px;
    border-top: 1px solid #e5e7eb;
  `,
};

// Helper function to create email wrapper
const createEmailWrapper = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .content { padding: 15px !important; }
            .header { padding: 15px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc;">
    <div class="container" style="${emailStyles.container}">
        <div class="header" style="${emailStyles.header}">
            <img src="${LetsCodeLogo}" alt="LetsCode" style="${emailStyles.logo}" />
            <h1 style="${emailStyles.headerTitle}">${title}</h1>
        </div>
        <div class="content" style="${emailStyles.content}">
            ${content}
        </div>
        ${getEmailFooter()}
    </div>
</body>
</html>
`;

// Simple email footer
const getEmailFooter = () => `
<div style="${emailStyles.footer}">
    <p style="margin: 0 0 10px 0;">
        <a href="${LetsCodeWebsite}" style="color: #2563eb; text-decoration: none;">Visit LetsCode</a> | 
        <a href="mailto:${LetsCodeEmail}" style="color: #2563eb; text-decoration: none;">Contact Support</a>
    </p>
    <p style="margin: 0;">
        © ${new Date().getFullYear()} LetsCode. All rights reserved.
    </p>
</div>
`;

// Interview Experience Accepted Email Template
export const InterviewExperienceAcceptedEmailTemplate = (
  name: string,
  publishedUrl: string,
  company: string,
  role: string
) => {
  const content = `
    <div style="${emailStyles.greeting}">Hi ${name},</div>
    
    <div style="${emailStyles.successBox}">
        <strong style="color: #16a34a;">Experience Published Successfully!</strong><br>
        <span style="color: #15803d;">${company} - ${role}</span>
    </div>
    
    <p style="${emailStyles.paragraph}">
        Your interview experience has been reviewed and published on our platform. 
        Thank you for sharing your insights with the community.
    </p>
    
    <div style="text-align: center;">
        <a href="${publishedUrl}" style="${emailStyles.button}">View Your Experience</a>
    </div>
    
    <div style="${emailStyles.infoBox}">
        <strong>What's next?</strong><br>
        • Your experience is now helping other candidates<br>
        • You may receive notifications for community interactions<br>
        • Feel free to share more experiences
    </div>
    
    <p style="${emailStyles.paragraph}">
        Best regards,<br>
        <strong>The LetsCode Team</strong>
    </p>
  `;

  return createEmailWrapper(content, 'Experience Published');
};

// Interview Experience Rejected Email Template
export const InterviewExperienceRejectedEmailTemplate = (
  name: string,
  reason: string,
  company: string,
  role: string,
  resubmitUrl?: string
) => {
  const content = `
    <div style="${emailStyles.greeting}">Hi ${name},</div>
    
    <div style="${emailStyles.errorBox}">
        <strong style="color: #dc2626;">Experience Needs Revision</strong><br>
        <span style="color: #b91c1c;">${company} - ${role}</span>
    </div>
    
    <p style="${emailStyles.paragraph}">
        Thank you for submitting your interview experience. Our review team has identified 
        areas that need improvement before publication.
    </p>
    
    <div style="${emailStyles.infoBox}">
        <strong>Feedback:</strong><br>
        "${reason}"
    </div>
    
    <div style="${emailStyles.infoBox}">
        <strong>Tips for improvement:</strong><br>
        • Include specific interview questions and your approach<br>
        • Organize content by interview rounds clearly<br>
        • Add preparation tips and resources<br>
        • Use professional language throughout<br>
        • Proofread for clarity and grammar
    </div>
    
    ${
      resubmitUrl
        ? `
    <div style="text-align: center;">
        <a href="${resubmitUrl}" style="${emailStyles.button}">Edit & Resubmit</a>
    </div>
    `
        : ''
    }
    
    <p style="${emailStyles.paragraph}">
        We encourage you to revise and resubmit your experience. If you have questions, 
        please contact our support team.
    </p>
    
    <p style="${emailStyles.paragraph}">
        Best regards,<br>
        <strong>The LetsCode Review Team</strong>
    </p>
  `;

  return createEmailWrapper(content, 'Experience Revision Required');
};

// Interview Experience Featured Email Template
export const InterviewExperienceFeaturedEmailTemplate = (
  name: string,
  company: string,
  role: string,
  featuredUrl: string,
  duration = 'the next few days'
) => {
  const content = `
    <div style="${emailStyles.greeting}">Hi ${name},</div>
    
    <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 4px; padding: 15px; margin: 15px 0; text-align: center;">
        <strong style="color: #92400e; font-size: 16px;">Your Experience is Now Featured!</strong><br>
        <span style="color: #92400e;">${company} - ${role}</span>
    </div>
    
    <p style="${emailStyles.paragraph}">
        Congratulations! Your interview experience has been selected as a featured story 
        and will be prominently displayed on our platform.
    </p>
    
    <div style="text-align: center;">
        <a href="${featuredUrl}" style="${emailStyles.button}">View Featured Experience</a>
    </div>
    
    <div style="${emailStyles.infoBox}">
        <strong>Being featured means:</strong><br>
        • Highlighted placement on our platform<br>
        • Increased visibility to help more candidates<br>
        • Recognition as a valuable contributor<br>
        • Featured status for ${duration}
    </div>
    
    <p style="${emailStyles.paragraph}">
        Thank you for making a difference in our community. Consider sharing this 
        achievement on your professional networks!
    </p>
    
    <p style="${emailStyles.paragraph}">
        Best regards,<br>
        <strong>The LetsCode Team</strong>
    </p>
  `;

  return createEmailWrapper(content, 'Experience Featured');
};

// Welcome Email Template
export const WelcomeEmailTemplate = (
  name: string,
  verificationUrl?: string
) => {
  const content = `
    <div style="${emailStyles.greeting}">Welcome to LetsCode, ${name}!</div>
    
    <p style="${emailStyles.paragraph}">
        Thank you for joining our community of developers and job seekers. 
        We're excited to have you on board!
    </p>
    
    ${
      verificationUrl
        ? `
    <div style="text-align: center;">
        <a href="${verificationUrl}" style="${emailStyles.button}">Verify Email Address</a>
    </div>
    `
        : ''
    }
    
    <div style="${emailStyles.infoBox}">
        <strong>What you can do on LetsCode:</strong><br>
        • Browse real interview experiences<br>
        • Share your own interview stories<br>
        • Get insights from top companies<br>
        • Connect with fellow developers<br>
        • Access preparation resources
    </div>
    
    <p style="${emailStyles.paragraph}">
        Best of luck with your interviews and coding journey!
    </p>
    
    <p style="${emailStyles.paragraph}">
        Best regards,<br>
        <strong>The LetsCode Team</strong>
    </p>
  `;

  return createEmailWrapper(content, 'Welcome to LetsCode');
};

// Experience Submission Confirmation Template
export const ExperienceSubmissionConfirmationTemplate = (
  name: string,
  company: string,
  role: string,
  estimatedReviewTime = '2-3 business days'
) => {
  const content = `
    <div style="${emailStyles.greeting}">Hi ${name},</div>
    
    <div style="${emailStyles.successBox}">
        <strong style="color: #16a34a;">Experience Submitted Successfully!</strong><br>
        <span style="color: #15803d;">${company} - ${role}</span>
    </div>
    
    <p style="${emailStyles.paragraph}">
        We've received your interview experience submission. Thank you for contributing 
        to our community!
    </p>
    
    <div style="${emailStyles.infoBox}">
        <strong>Review Process:</strong><br>
        • Our team will review your submission<br>
        • We'll check for completeness and guidelines compliance<br>
        • You'll receive notification of our decision<br>
        • Estimated review time: <strong>${estimatedReviewTime}</strong>
    </div>
    
    <p style="${emailStyles.paragraph}">
        While you wait, feel free to browse other experiences on our platform.
    </p>
    
    <p style="${emailStyles.paragraph}">
        Best regards,<br>
        <strong>The LetsCode Team</strong>
    </p>
  `;

  return createEmailWrapper(content, 'Submission Received');
};

export {
  LetsCodeLogo,
  LetsCodeWebsite,
  LetsCodeEmail,
  emailStyles,
  createEmailWrapper,
  getEmailFooter,
};
