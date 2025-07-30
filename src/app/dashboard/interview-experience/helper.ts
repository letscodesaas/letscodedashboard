import { InterviewExperience } from "../../../../types/interview";

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'approved':
            return 'bg-green-50 text-green-700 border-green-200';
        case 'rejected':
            return 'bg-red-50 text-red-700 border-red-200';
        case 'pending':
            return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200';
    }
};

export const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'Easy':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'Medium':
            return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'Hard':
            return 'bg-red-50 text-red-700 border-red-200';
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200';
    }
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
export const getStatus = (experience: InterviewExperience) => {
    if (experience.isApproved) return 'approved';
    if (experience.feedback) return 'rejected';
    return 'pending';
};