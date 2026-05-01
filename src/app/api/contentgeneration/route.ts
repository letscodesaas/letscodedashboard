import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const prompt = `
    {
      systemPrompt:"Generate an email template for ${data.topic} in HTML with inline CSS for a modern, 
      responsive design. The template should include a header,
       a main content section with a call-to-action button, and a 
       footer. The design should be clean, professional, and mobile-friendly.
        Provide only the HTML and CSS code without any additional text or 
        explanations. And company name is Let's code and don't add template
         that will add custom variable until user is asked for. Also this link to unsubscribe link/button https://www.lets-code.co.in/unsubscribe/ with target="_blank"
         Do not include markdown, code fences, or html tags.
         Output must be plain text HTML only
         No markdown
          No triple backticks
         "
      output:"text"
      format:"html"
      example:"
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to [Your Company Name]</title>
  <style type="text/css">
    /* Basic Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f4f6f8; }

    /* General Styles */
    .wrapper {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .content {
      padding: 30px;
      text-align: center;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
    }
    .content h1 {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #2c3e50;
    }
    .content p {
      font-size: 16px;
      margin-bottom: 20px;
    }

    /* Header Styles */
    .header {
      background-color: #007bff; /* Primary brand color */
      padding: 25px 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff !important;
      font-size: 30px;
      margin: 0;
      font-weight: bold;
    }
    .header img {
      max-width: 150px;
      height: auto;
    }

    /* Call to Action Button */
    .cta-button {
      display: inline-block;
      padding: 15px 30px;
      background-color: #28a745; /* Success color for CTA */
      color: #ffffff !important;
      text-decoration: none;
      font-size: 18px;
      font-weight: bold;
      border-radius: 5px;
      margin-top: 10px;
    }
    .cta-button:hover {
      background-color: #218838;
    }

    /* Footer Styles */
    .footer {
      background-color: #e9ecef;
      padding: 25px 30px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    .footer a {
      color: #6c757d;
      text-decoration: underline;
    }

    /* Responsive adjustments */
    @media screen and (max-width: 600px) {
      .wrapper {
        width: 100% !important;
        border-radius: 0;
      }
      .header, .content, .footer {
        padding: 20px !important;
      }
      .content h1 {
        font-size: 24px !important;
      }
      .content p {
        font-size: 15px !important;
      }
      .cta-button {
        padding: 12px 25px !important;
        font-size: 16px !important;
      }
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f6f8;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="background-color: #f4f6f8;">
        <!-- Wrapper Table -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapper" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <!-- Header Section -->
          <tr>
            <td align="center" class="header" style="background-color: #007bff; padding: 25px 30px; text-align: center;">
              <!-- You can include a logo here -->
              <!-- <img src="your-logo-url.png" alt="[Your Company Logo]" style="max-width: 150px; height: auto; display: block; margin: 0 auto;"> -->
              <h1 style="color: #ffffff !important; font-size: 30px; margin: 0; font-weight: bold;">Welcome to [Your Company Name]!</h1>
            </td>
          </tr>
          <!-- Main Content Section -->
          <tr>
            <td class="content" style="padding: 30px; text-align: center; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333;">
              <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 15px; color: #2c3e50;">Great to have you on board!</h1>
              <p style="font-size: 16px; margin-bottom: 20px;">Thank you for joining [Your Company Name]. We're thrilled to have you as part of our community. Get started by exploring your new account and discovering all the amazing features we have to offer.</p>

              <!-- Call to Action Button -->
              <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-top: 20px;">
                <tr>
                  <td align="center" style="border-radius: 5px; background-color: #28a745;">
                    <a href="[Your Call to Action Link]" target="_blank" class="cta-button" style="display: inline-block; padding: 15px 30px; background-color: #28a745; color: #ffffff !important; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 5px; margin-top: 10px;">Get Started Now</a>
                  </td>
                </tr>
              </table>
              <p style="font-size: 16px; margin-top: 30px;">If you have any questions, feel free to reply to this email or visit our <a href="[Your Support Link]" style="color: #007bff; text-decoration: underline;">Help Center</a>.</p>
            </td>
          </tr>
          <!-- Footer Section -->
          <tr>
            <td class="footer" style="background-color: #e9ecef; padding: 25px 30px; text-align: center; font-size: 12px; color: #6c757d; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
              <p style="margin: 0;">© 2023 [Your Company Name]. All rights reserved.</p>
              <p style="margin: 5px 0 0 0;">[Your Company Address]</p>
              <p style="margin: 5px 0 0 0;"><a href="[Your Unsubscribe Link]" style="color: #6c757d; text-decoration: underline;">Unsubscribe</a> from these emails.</p>
            </td>
          </tr>
        </table>
        <!-- End Wrapper Table -->
      </td>
    </tr>
  </table>
</body>
</html>
      
      "

    }
    
    `;
    const result = await model.generateContent(prompt);
    return NextResponse.json(
      { message: result.response.text() },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
};
