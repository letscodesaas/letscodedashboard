// src/template/interview.ts

const LetsCodeLogo =
  'https://d3l4smlx4vuygm.cloudfront.net/IMG_20250123_135429_806.webp';
const LetsCodeWebsite = 'https://lets-code.co.in';
const LetsCodeEmail = 'letscode@lets-code.co.in';

// Base email styles for consistent design
const emailStyles = {
  container: `
    max-width: 600px;
    margin: 0 auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8fafc;
  `,
  header: `
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    padding: 30px 20px;
    text-align: center;
    border-radius: 12px 12px 0 0;
  `,
  logo: `
    max-width: 120px;
    height: auto;
    margin-bottom: 15px;
  `,
  headerTitle: `
    color: white;
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `,
  content: `
    background: white;
    padding: 40px 30px;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `,
  greeting: `
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 20px;
  `,
  paragraph: `
    margin-bottom: 16px;
    color: #4b5563;
    font-size: 16px;
  `,
  button: `
    display: inline-block;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 14px 28px;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin: 20px 0;
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
    transition: transform 0.2s ease;
  `,
  successBox: `
    background: #f0fdf4;
    border: 2px solid #22c55e;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  `,
  errorBox: `
    background: #fef2f2;
    border: 2px solid #ef4444;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  `,
  featuredBox: `
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    color: white;
    text-align: center;
  `,
  tipsList: `
    background: #f8fafc;
    border-left: 4px solid #3b82f6;
    padding: 20px;
    margin: 20px 0;
    border-radius: 0 8px 8px 0;
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
</head>
<body style="margin: 0; padding: 20px; background-color: #f8fafc;">
    <div style="${emailStyles.container}">
        <div style="${emailStyles.header}">
            <img src="${LetsCodeLogo}" alt="LetsCode Logo" style="${emailStyles.logo}" />
            <h1 style="${emailStyles.headerTitle}">${title}</h1>
        </div>
        <div style="${emailStyles.content}">
            ${content}
        </div>
        ${getEmailFooter()}
    </div>
</body>
</html>
`;

// Email footer component
const getEmailFooter = () => `
<div style="background: #1f2937; color: #9ca3af; padding: 30px 20px; text-align: center; border-radius: 0 0 12px 12px;">
    <div style="margin-bottom: 20px;">
        <img src="${LetsCodeLogo}" alt="LetsCode" style="max-width: 80px; height: auto; opacity: 0.8;" />
    </div>
    
    <p style="margin: 0 0 15px 0; font-size: 14px;">
        This email was sent because you recently shared your interview experience on the LetsCode platform.
    </p>
    
    <div style="margin: 20px 0;">
        <a href="${LetsCodeWebsite}" style="color: #60a5fa; text-decoration: none; margin: 0 15px; font-weight: 500;">
            🌐 Visit Website
        </a>
        <a href="mailto:${LetsCodeEmail}" style="color: #60a5fa; text-decoration: none; margin: 0 15px; font-weight: 500;">
            ✉️ Contact Support
        </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #374151; margin: 20px 0;" />
    
    <p style="margin: 0; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} LetsCode. All rights reserved. | 
        <a href="${LetsCodeWebsite}/privacy" style="color: #9ca3af; text-decoration: none;">Privacy Policy</a> | 
        <a href="${LetsCodeWebsite}/terms" style="color: #9ca3af; text-decoration: none;">Terms of Service</a>
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
    <div style="${emailStyles.greeting}">🎉 Congratulations, ${name}!</div>
    
    <div style="${emailStyles.successBox}">
        <h3 style="color: #16a34a; margin: 0 0 10px 0; font-size: 18px;">
            ✅ Your Interview Experience Has Been Published!
        </h3>
        <p style="margin: 0; color: #15803d; font-weight: 500;">
            ${company} - ${role}
        </p>
    </div>
    
    <p style="${emailStyles.paragraph}">
        We're thrilled to inform you that your interview experience has been reviewed, approved, and successfully published on our platform! 
    </p>
    
    <p style="${emailStyles.paragraph}">
        Your detailed insights about the <strong>${company}</strong> interview process for the <strong>${role}</strong> position will be incredibly valuable to our community members who are preparing for similar opportunities.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${publishedUrl}" style="${emailStyles.button}">
            🔗 View Your Published Experience
        </a>
    </div>
    
    <div style="${emailStyles.tipsList}">
        <h4 style="color: #1f2937; margin: 0 0 15px 0;">What happens next?</h4>
        <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
            <li>Your experience is now live and helping other candidates</li>
            <li>You'll receive notifications if your post gets featured</li>
            <li>Community members may reach out for additional insights</li>
            <li>You can share your published experience on social media</li>
        </ul>
    </div>
    
    <p style="${emailStyles.paragraph}">
        Thank you for contributing to our community and helping fellow job seekers succeed in their interview journeys!
    </p>
    
    <p style="${emailStyles.paragraph}">
        If you have any questions or would like to share another experience, feel free to reach out to us.
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Best regards,<br/>
            <strong style="color: #1f2937;">The LetsCode Team</strong>
        </p>
    </div>
  `;

  return createEmailWrapper(content, 'Experience Published Successfully!');
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
    <div style="${emailStyles.greeting}">Hello ${name},</div>
    
    <div style="${emailStyles.errorBox}">
        <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px;">
            📝 Experience Needs Revision
        </h3>
        <p style="margin: 0; color: #b91c1c; font-weight: 500;">
            ${company} - ${role}
        </p>
    </div>
    
    <p style="${emailStyles.paragraph}">
        Thank you for taking the time to share your interview experience with our community. After careful review, 
        our team has identified some areas that need improvement before we can publish your submission.
    </p>
    
    <div style="${emailStyles.errorBox}">
        <h4 style="color: #dc2626; margin: 0 0 15px 0;">Feedback from our review team:</h4>
        <blockquote style="margin: 0; padding: 15px; background: white; border-radius: 6px; font-style: italic; color: #374151;">
            "${reason}"
        </blockquote>
    </div>
    
    <div style="${emailStyles.tipsList}">
        <h4 style="color: #1f2937; margin: 0 0 15px 0;">💡 Tips for a successful submission:</h4>
        <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
            <li><strong>Be Detailed:</strong> Include specific questions asked and your approach to solving them</li>
            <li><strong>Structure Well:</strong> Organize your experience by interview rounds with clear descriptions</li>
            <li><strong>Add Value:</strong> Share preparation tips and resources that helped you</li>
            <li><strong>Stay Professional:</strong> Use respectful language and avoid sharing sensitive information</li>
            <li><strong>Proofread:</strong> Check for grammatical errors and ensure clarity</li>
            <li><strong>Include Context:</strong> Mention your background, preparation time, and overall experience</li>
        </ul>
    </div>
    
    <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #1e40af; margin: 0 0 10px 0;">🚀 Ready to resubmit?</h4>
        <p style="margin: 0 0 15px 0; color: #1e40af;">
            We encourage you to revise your experience based on the feedback above and resubmit it.
        </p>
        ${
          resubmitUrl
            ? `
        <div style="text-align: center;">
            <a href="${resubmitUrl}" style="${emailStyles.button}">
                ✏️ Edit & Resubmit Experience
            </a>
        </div>
        `
            : ''
        }
    </div>
    
    <p style="${emailStyles.paragraph}">
        We appreciate your effort in sharing your experience and believe that with these improvements, 
        your story will be incredibly valuable to our community.
    </p>
    
    <p style="${emailStyles.paragraph}">
        If you have any questions about the feedback or need clarification on any points, 
        please don't hesitate to reach out to our support team.
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Thank you for your understanding,<br/>
            <strong style="color: #1f2937;">The LetsCode Review Team</strong>
        </p>
    </div>
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
    <div style="${emailStyles.greeting}">🌟 Amazing news, ${name}!</div>
    
    <div style="${emailStyles.featuredBox}">
        <h2 style="margin: 0 0 10px 0; font-size: 24px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            ⭐ YOUR EXPERIENCE IS NOW FEATURED! ⭐
        </h2>
        <p style="margin: 0; font-size: 18px; opacity: 0.95;">
            ${company} - ${role}
        </p>
    </div>
    
    <p style="${emailStyles.paragraph}">
        We're absolutely thrilled to inform you that your interview experience has been selected as a 
        <strong>Featured Experience</strong> on our platform!
    </p>
    
    <p style="${emailStyles.paragraph}">
        Your detailed and insightful account of the <strong>${company}</strong> interview process has impressed our team 
        and will be prominently displayed to help thousands of job seekers in their preparation journey.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${featuredUrl}" style="${emailStyles.button}">
            🎯 View Your Featured Experience
        </a>
    </div>
    
    <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #0c4a6e; margin: 0 0 15px 0;">🎉 What does being featured mean?</h4>
        <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
            <li>Your experience will be highlighted at the top of our platform</li>
            <li>Increased visibility to help more candidates</li>
            <li>Recognition as a valuable community contributor</li>
            <li>Featured status for ${duration}</li>
            <li>Special badge on your experience post</li>
        </ul>
    </div>
    
    <div style="${emailStyles.tipsList}">
        <h4 style="color: #1f2937; margin: 0 0 15px 0;">📈 Maximize your impact:</h4>
        <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
            <li>Share your featured experience on LinkedIn and other social platforms</li>
            <li>Engage with community members who comment on your post</li>
            <li>Consider sharing more experiences from other companies</li>
            <li>Help mentor others in our community forums</li>
        </ul>
    </div>
    
    <p style="${emailStyles.paragraph}">
        Your contribution is making a real difference in helping job seekers succeed. Thank you for being 
        an invaluable part of the LetsCode community!
    </p>
    
    <p style="${emailStyles.paragraph}">
        We'd love to feature more of your experiences if you have additional interview stories to share.
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Congratulations once again,<br/>
            <strong style="color: #1f2937;">The LetsCode Team</strong>
        </p>
    </div>
  `;

  return createEmailWrapper(content, '🌟 Your Experience is Now Featured!');
};

// Welcome Email Template for New Users
export const WelcomeEmailTemplate = (
  name: string,
  verificationUrl?: string
) => {
  const content = `
    <div style="${emailStyles.greeting}">Welcome to LetsCode, ${name}! 🎉</div>
    
    <p style="${emailStyles.paragraph}">
        We're excited to have you join our community of ambitious developers and job seekers!
    </p>
    
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; font-size: 20px;">🚀 Ready to get started?</h3>
        <p style="margin: 0; opacity: 0.9;">Join thousands of developers sharing their interview experiences</p>
    </div>
    
    ${
      verificationUrl
        ? `
    <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="${emailStyles.button}">
            ✅ Verify Your Email Address
        </a>
    </div>
    `
        : ''
    }
    
    <div style="${emailStyles.tipsList}">
        <h4 style="color: #1f2937; margin: 0 0 15px 0;">🎯 What you can do on LetsCode:</h4>
        <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
            <li>Browse thousands of real interview experiences</li>
            <li>Share your own interview stories to help others</li>
            <li>Get insights from top companies like Google, Microsoft, Amazon</li>
            <li>Connect with fellow developers and job seekers</li>
            <li>Access preparation resources and tips</li>
        </ul>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Happy coding and best of luck with your interviews!<br/>
            <strong style="color: #1f2937;">The LetsCode Team</strong>
        </p>
    </div>
  `;

  return createEmailWrapper(content, 'Welcome to LetsCode Community!');
};

// Experience Submission Confirmation Email
export const ExperienceSubmissionConfirmationTemplate = (
  name: string,
  company: string,
  role: string,
  estimatedReviewTime = '2-3 business days'
) => {
  const content = `
    <div style="${emailStyles.greeting}">Thank you, ${name}! 📝</div>
    
    <div style="background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">
            ✅ Experience Submitted Successfully!
        </h3>
        <p style="margin: 0; color: #1e40af; font-weight: 500;">
            ${company} - ${role}
        </p>
    </div>
    
    <p style="${emailStyles.paragraph}">
        We've successfully received your interview experience submission. Thank you for taking the time to share 
        your insights with our community!
    </p>
    
    <div style="${emailStyles.tipsList}">
        <h4 style="color: #1f2937; margin: 0 0 15px 0;">📋 What happens next?</h4>
        <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
            <li>Our review team will carefully examine your submission</li>
            <li>We'll check for completeness, accuracy, and community guidelines compliance</li>
            <li>You'll receive an email notification with the review decision</li>
            <li>If approved, your experience will be published on our platform</li>
            <li>Estimated review time: <strong>${estimatedReviewTime}</strong></li>
        </ul>
    </div>
    
    <p style="${emailStyles.paragraph}">
        While you wait, feel free to browse other interview experiences on our platform and continue your preparation journey.
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Thank you for contributing to our community,<br/>
            <strong style="color: #1f2937;">The LetsCode Team</strong>
        </p>
    </div>
  `;

  return createEmailWrapper(content, 'Experience Submission Received');
};

export {
  LetsCodeLogo,
  LetsCodeWebsite,
  LetsCodeEmail,
  emailStyles,
  createEmailWrapper,
  getEmailFooter,
};
