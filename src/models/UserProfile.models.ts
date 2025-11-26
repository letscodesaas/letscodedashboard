import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  location: String,
  startYear: String,
  endYear: String,
  cgpa: String,
  public: { type: Boolean, default: true },
});

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  startDate: String,
  endDate: String,
  public: { type: Boolean, default: true },
});

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  techStack: [String],
  githubLink: String,
  liveDemo: String,
  role: String,
  public: { type: Boolean, default: true },
});

const CertificationSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  issueDate: String,
  credentialUrl: String,
  public: { type: Boolean, default: true },
});

const BlogSchema = new mongoose.Schema({
  title: String,
  platform: String,
  url: String,
  summary: String,
  public: { type: Boolean, default: true },
});

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: String }, // Clerk ID
    email: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    role: {
      type: String,
      enum: ['student', 'professional', 'mentor', 'admin'],
      default: 'student',
    },

    // ✅ Verification (Authentication will handle by Clerk)
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },

    subscription: { type: Boolean, default: false },
    typeOfSubscription: { type: String, default: null },

    notificationPreferences: {
      emailUpdates: { type: Boolean, default: true },
      whatsappUpdates: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: false },
    },

    // ✨ Public profile/resume additions:
    username: { type: String, unique: true },
    profilePic: { type: String },
    headline: { type: String },
    bio: { type: String },

    phone: { type: String },
    location: { type: String },
    portfolio: { type: String },
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String },
    whatsapp: { type: String },
    resumeURL: { type: String },

    // ✅ Profile Completion Status
    isProfileComplete: { type: Boolean, default: false },
    isProfilePublic: { type: Boolean, default: false },

    // ✅ Public Visibility Controls
    publicProfile: { type: Boolean, default: false },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    showResume: { type: Boolean, default: false },

    // 💼 Profile Sections
    education: [EducationSchema],
    experience: [ExperienceSchema],
    skills: [String],
    projects: [ProjectSchema],
    certifications: [CertificationSchema],
    achievements: [String],
    blogs: [BlogSchema],
    interests: [String],
    languages: [String],

    // ✅ Gamification and Engagement
    badges: [{ type: String }],
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },

    // ✅ Analytics and Tracking
    views: { type: Number, default: 0 },
  },

  { timestamps: true }
);


// Add indexes for filtering performance
userProfileSchema.index({ role: 1 });
userProfileSchema.index({ publicProfile: 1 });

export const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model('UserProfile', userProfileSchema);
