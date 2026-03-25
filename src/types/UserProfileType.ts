export interface Education {
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  cgpa: string;
  public?: boolean;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  public?: boolean;
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveDemo: string;
  role: string;
  public?: boolean;
}

export interface Certification {
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  public?: boolean;
}

export interface Blog {
  title: string;
  platform: string;
  url: string;
  summary: string;
  public?: boolean;
}

export interface UserProfileType {
  userId?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  subscription?: boolean;
  typeOfSubscription?: string | null;
  notificationPreferences?: {
    emailUpdates?: boolean;
    whatsappUpdates?: boolean;
    pushNotifications?: boolean;
  };
  username?: string;
  profilePic?: string;
  headline?: string;
  bio?: string;
  phone?: string;
  location?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  whatsapp?: string;
  resumeURL?: string;
  isProfileComplete?: boolean;
  isProfilePublic?: boolean;
  publicProfile?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  showResume?: boolean;
  education?: Education[];
  experience?: Experience[];
  skills?: string[];
  projects?: Project[];
  certifications?: Certification[];
  achievements?: string[];
  blogs?: Blog[];
  interests?: string[];
  languages?: string[];
  badges?: string[];
  points?: number;
  level?: number;
  views?: number;
  createdAt?: string;
}
