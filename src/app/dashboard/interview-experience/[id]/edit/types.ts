// src/app/interview-experience/types.ts
export interface Round {
  roundTitle: string;
  roundDescription: string;
  roundDate?: string; // ISO Date string
}

export type JobType =
  | 'Internship'
  | 'Full-Time'
  | 'PPO'
  | 'On-Campus'
  | 'Off-Campus'
  | 'Referral';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type OfferStatus = 'Selected' | 'Rejected' | 'Waiting for Results';

export interface InterviewExperience {
  _id: string;
  name: string;
  email?: string;
  company: string;
  role: string;
  jobType: JobType;
  location?: string;
  interviewDate?: string; // ISO Date string
  graduationYear?: number;
  collegeName?: string;
  currentStatus: string;
  currentRole?: string;
  duration?: string; // e.g. "6 months"
  packageCTC?: string; // e.g. "6 LPA"
  resumeLink?: string;
  resourcesUsed?: string[];
  technologies?: string[];
  rounds: Round[];
  roundsCount?: number; // computed or optional
  detailedExperience: string;
  difficultyLevel: DifficultyLevel;
  tags: string[];
  offerStatus: OfferStatus;
  createdAt: string; // ISO Date string
  isApproved: boolean;
  isFeatured: boolean;
  isAnonymous: boolean;
  linkedIn?: string;
  github?: string;
  feedback?: string;
}
