// These are the email template gallery for interview experience sharing students.
export const InterviewExperienceAcceptedEmailTemplate = (name: string) => {
    return `
    <h1>Dear ${name},</h1><br/>
    <p>We are pleased to inform you that your interview experience that you shared on our platform has been accepted by our team and published successfully.</p>
    <p>Thank you for sharing your valuable insights with the community. Your contribution will help many others in their interview preparation.</p>
    <p>If you have any questions or need further assistance, please feel free to reach out to us at <a href="mailto:letscode@lets-code.co.in">letscode@lets-code.co.in</a>.</p><br/>
    <p>Best regards,</p><br/>
    <p>The LetsCode Team</p>
    `;
}

// This is the email template for interview experience rejection.
    export const InterviewExperienceRejectedEmailTemplate = (name: string, reason: string) => {
        return `
    <h1>Dear ${name},</h1><br/>
    <p>We regret to inform you that your interview experience that you shared on our platform has been rejected to be published.</p>
    <br/>
    <p>Reason given by our team:</p>
    <blockquote>    
    <p>${reason}</p>
    </blockquote>
    <p>We appreciate your effort in sharing your experience, Kindly fix the issues mentioned above and resubmit your experience.</p>
    <p>If you have any questions or need further clarification, please feel free to reach out to us at <a href="mailto:letscode@lets-code.co.in">letscode@lets-code.co.in</a>.</p>
    <p>Thank you for your understanding.</p><br/>
    <p>Best regards,</p><br/>
    <p>The LetsCode Team</p>
  `;
}

// This is the email template for interview experience get featured on our platform.
export const InterviewExperienceFeaturedEmailTemplate = (name: string) => {
    return `
    <h1>Dear ${name},</h1><br/>
    <p>We are excited to inform you that your interview experience has been selected to be featured on our platform for the some few next days.</p>
    <p>Your contribution is invaluable to our community, and we believe that your experience will inspire and help many others in their interview preparation.</p>
    <p>If you have any questions or need further assistance, please feel free to reach out to us at <a href="mailto:letscode@lets-code.co.in">letscode@lets-code.co.in</a>.</p><br/>
    <p>Best regards,</p><br/>
    <p>The LetsCode Team</p>
    `;
}
