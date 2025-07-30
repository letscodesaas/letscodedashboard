import { InterviewExperience } from '../../../../types/interview';

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'Medium':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Hard':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const getOfferStatusColor = (status: string): string => {
  switch (status) {
    case 'Selected':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'Rejected':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Waiting for Results':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'rejected':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const getStatus = (experience: InterviewExperience): string => {
  if (experience.isApproved) return 'approved';
  if (experience.feedback) return 'rejected';
  return 'pending';
};
