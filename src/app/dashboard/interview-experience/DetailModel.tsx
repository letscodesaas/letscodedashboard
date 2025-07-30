'use client';
import { Button } from '@/components/ui/button';
import type { InterviewExperience } from '../../../../types/interview';
import { getStatusColor, formatDate, getStatus } from './helper';
import ReactMarkdown from 'react-markdown';
import {
  AlertTriangle,
  Trash2,
  X,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  DollarSign,
  Clock,
  ExternalLink,
  Github,
  Linkedin,
  FileText,
  Code,
  BookOpen,
  User,
  EyeOff,
} from 'lucide-react';

export const DetailModal = ({
  selectedExperience,
  setShowDetailModal,
  setSelectedExperienceId,
  approveExperience,
  loading,
  setShowDeleteConfirm,
  setShowRejectModal,
}: {
  selectedExperience: InterviewExperience;
  setShowDetailModal: (show: boolean) => void;
  setSelectedExperienceId: (id: string | null) => void;
  approveExperience: (id: string) => Promise<void>;
  loading: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  setShowRejectModal: (show: boolean) => void;
}) => {
  const status = getStatus(selectedExperience);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedExperience.company} - {selectedExperience.role}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}
                >
                  {status}
                </span>
                {selectedExperience.isFeatured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full border border-yellow-200">
                    Featured
                  </span>
                )}
                {selectedExperience.isAnonymous && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    Anonymous
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                Submitted by{' '}
                {selectedExperience.isAnonymous
                  ? 'Anonymous User'
                  : selectedExperience.name}{' '}
                • {formatDate(selectedExperience.createdAt)}
              </p>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Quick Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Job Type
                </span>
              </div>
              <p className="text-blue-800 font-semibold">
                {selectedExperience.jobType}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-3 h-3 rounded-full ${
                    selectedExperience.difficultyLevel === 'Easy'
                      ? 'bg-green-500'
                      : selectedExperience.difficultyLevel === 'Medium'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                />
                <span className="text-sm font-medium text-green-900">
                  Difficulty
                </span>
              </div>
              <p className="text-green-800 font-semibold">
                {selectedExperience.difficultyLevel}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-purple-900">
                  Offer Status
                </span>
              </div>
              <p
                className={`font-semibold ${
                  selectedExperience.offerStatus === 'Selected'
                    ? 'text-green-700'
                    : selectedExperience.offerStatus === 'Rejected'
                      ? 'text-red-700'
                      : 'text-yellow-700'
                }`}
              >
                {selectedExperience.offerStatus}
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-orange-900">
                  Rounds
                </span>
              </div>
              <p className="text-orange-800 font-semibold">
                {selectedExperience.rounds?.length || 0}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Job Details */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Job Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company:</span>
                    <span className="font-medium">
                      {selectedExperience.company}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium">
                      {selectedExperience.role}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type:</span>
                    <span className="font-medium">
                      {selectedExperience.jobType}
                    </span>
                  </div>
                  {selectedExperience.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Location:
                      </span>
                      <span className="font-medium">
                        {selectedExperience.location}
                      </span>
                    </div>
                  )}
                  {selectedExperience.interviewDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Interview Date:
                      </span>
                      <span className="font-medium">
                        {formatDate(selectedExperience.interviewDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Candidate Information */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Candidate Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">
                      {selectedExperience.isAnonymous
                        ? 'Anonymous'
                        : selectedExperience.name}
                    </span>
                  </div>
                  {!selectedExperience.isAnonymous &&
                    selectedExperience.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">
                          {selectedExperience.email}
                        </span>
                      </div>
                    )}
                  {selectedExperience.graduationYear && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        Graduation Year:
                      </span>
                      <span className="font-medium">
                        {selectedExperience.graduationYear}
                      </span>
                    </div>
                  )}
                  {selectedExperience.collegeName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">College:</span>
                      <span className="font-medium">
                        {selectedExperience.collegeName}
                      </span>
                    </div>
                  )}
                  {selectedExperience.currentStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Status:</span>
                      <span className="font-medium">
                        {selectedExperience.currentStatus}
                      </span>
                    </div>
                  )}
                  {selectedExperience.currentRole && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Role:</span>
                      <span className="font-medium">
                        {selectedExperience.currentRole}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Compensation & Duration */}
              {(selectedExperience.packageCTC ||
                selectedExperience.duration) && (
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Compensation & Duration
                  </h4>
                  <div className="space-y-3 text-sm">
                    {selectedExperience.packageCTC && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package (CTC):</span>
                        <span className="font-medium text-green-700">
                          {selectedExperience.packageCTC}
                        </span>
                      </div>
                    )}
                    {selectedExperience.duration && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Duration:
                        </span>
                        <span className="font-medium">
                          {selectedExperience.duration}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Technologies */}
              {selectedExperience.technologies &&
                selectedExperience.technologies.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedExperience.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Resources Used */}
              {selectedExperience.resourcesUsed &&
                selectedExperience.resourcesUsed.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Resources Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedExperience.resourcesUsed.map(
                        (resource, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full border border-green-200"
                          >
                            {resource}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Links & Resume */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Links & Resume
                </h4>
                <div className="space-y-3">
                  {selectedExperience.resumeLink && (
                    <a
                      href={selectedExperience.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      View Resume
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {!selectedExperience.isAnonymous &&
                    selectedExperience.linkedIn && (
                      <a
                        href={selectedExperience.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn Profile
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  {!selectedExperience.isAnonymous &&
                    selectedExperience.github && (
                      <a
                        href={selectedExperience.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm"
                      >
                        <Github className="w-4 h-4" />
                        GitHub Profile
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  {!selectedExperience.resumeLink &&
                    !selectedExperience.linkedIn &&
                    !selectedExperience.github && (
                      <p className="text-gray-500 text-sm">No links provided</p>
                    )}
                </div>
              </div>

              {/* Submission Details */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Submission Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">
                      {formatDate(selectedExperience.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approved:</span>
                    <span
                      className={`font-medium ${selectedExperience.isApproved ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {selectedExperience.isApproved ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Featured:</span>
                    <span
                      className={`font-medium ${selectedExperience.isFeatured ? 'text-yellow-600' : 'text-gray-600'}`}
                    >
                      {selectedExperience.isFeatured ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Anonymous:</span>
                    <span className="font-medium">
                      {selectedExperience.isAnonymous ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Rounds */}
          {selectedExperience.rounds &&
            selectedExperience.rounds.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                  Interview Rounds
                </h4>
                <div className="space-y-4">
                  {selectedExperience.rounds.map((round, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-semibold text-gray-900">
                          Round {index + 1}: {round.roundTitle}
                        </h5>
                        {round.roundDate && (
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(round.roundDate)}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        <ReactMarkdown>{round.roundDescription}</ReactMarkdown>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Tags */}
          {selectedExperience.tags && selectedExperience.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedExperience.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Experience */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">
              Detailed Experience
            </h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                <ReactMarkdown>
                  {selectedExperience.detailedExperience ||
                    'No detailed experience provided.'}
                </ReactMarkdown>
              </p>
            </div>
          </div>

          {/* Rejection Feedback */}
          {status === 'rejected' && selectedExperience.feedback && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Rejection Feedback
              </h4>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{selectedExperience.feedback}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => {
                setSelectedExperienceId(selectedExperience._id);
                approveExperience(selectedExperience._id);
                setShowDetailModal(false);
              }}
              variant="outline"
              disabled={loading || selectedExperience.isApproved}
              className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
            >
              {selectedExperience.isApproved ? 'Already Approved' : 'Approve'}
            </Button>
            <Button
              onClick={() => {
                setSelectedExperienceId(selectedExperience._id);
                setShowRejectModal(true);
              }}
              variant="outline"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
              disabled={loading || status === 'rejected'}
            >
              {status === 'rejected' ? 'Already Rejected' : 'Reject'}
            </Button>
            <Button
              onClick={() => {
                setSelectedExperienceId(selectedExperience._id);
                setShowDeleteConfirm(true);
              }}
              variant="destructive"
              className="px-6"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RejectionModal = ({
  selectedExperienceId,
  setShowRejectModal,
  rejectExperience,
  loading,
  feedback,
  setFeedback,
}: {
  selectedExperienceId: string | null;
  setShowRejectModal: (show: boolean) => void;
  rejectExperience: (id: string) => void;
  loading: boolean;
  feedback: string;
  setFeedback: (feedback: string) => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Reject Experience
              </h3>
              <p className="text-gray-600">Provide feedback for rejection</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Feedback *
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Please provide specific feedback about why this experience is being rejected..."
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowRejectModal(false);
                setFeedback('');
              }}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                selectedExperienceId && rejectExperience(selectedExperienceId)
              }
              disabled={!feedback.trim() || loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DeleteConfirmationModal = ({
  selectedExperienceId,
  setShowDeleteConfirm,
  deleteExperience,
  loading,
}: {
  selectedExperienceId: string | null;
  setShowDeleteConfirm: (show: boolean) => void;
  deleteExperience: (id: string) => void;
  loading: boolean;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Experience
              </h3>
              <p className="text-gray-600">This action cannot be undone</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to permanently delete this interview
            experience? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                selectedExperienceId && deleteExperience(selectedExperienceId)
              }
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
