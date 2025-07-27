export interface Round {
  roundTitle: string;
  roundDescription: string;
}

export interface InterviewExperience {
  _id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  jobType: string;
  location?: string;
  interviewDate?: string;
  graduationYear?: number;
  rounds: Round[];
  detailedExperience: string;
  difficultyLevel: string;
  tags: string[];
  offerStatus: string;
  createdAt: string;
  isApproved: boolean;
  isFeatured: boolean;
  isAnonymous: boolean;
  feedback?: string;
}
