'use client';
import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Check,
  X,
  Star,
  Trash2,
  Building2,
  Clock,
  Download,
  AlertTriangle,
  CheckCircle,
  StarOff,
} from 'lucide-react';
import { InterviewExperience } from '../../../../types/interview';
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const AdminDashboard = () => {
  const [interviewExperiences, setInterviewExperiences] = useState<
    InterviewExperience[]
  >([]);
  const [pendingExperiences, setPendingExperiences] = useState<
    InterviewExperience[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [selectedExperienceId, setSelectedExperienceId] = useState<
    string | null
  >(null);
  const errorRef = React.useRef<HTMLDivElement>(null);
  const { token } = useAuth();

  // UI State
  const [activeTab, setActiveTab] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperience, setSelectedExperience] =
    useState<InterviewExperience | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    (async () => {
      await fetchInterviewExperiences();
      await fetchPendingExperiences();
    })();
  }, []);

  useEffect(() => {
    if (error || successMessage) {
      // Scroll to the error message if it exists
      // setTimeout(() => {
      //     // set all modals to false and message to null
      //     setShowDetailModal(false);
      //     setShowRejectModal(false);
      //     setShowDeleteConfirm(false);
      //     setError(null);
      //     setSuccessMessage(null);
      //     errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      // }, 100);
      // clear the error and success message after 5 seconds
      setTimeout(() => {
        clearMessages();
      }, 5000);
    }
  }, [error, successMessage]);

  // Your existing API functions
  const fetchInterviewExperiences = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interview-experiences');
      const data = await response.json();
      if (data.success) {
        setInterviewExperiences(data.data);
      } else {
        setError(data.message);
      }
    } catch {
      toast.error('Failed to fetch interview experiences');
      setError('Failed to fetch interview experiences');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingExperiences = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interview-experiences/pending');
      const data = await response.json();
      if (data.success) {
        setPendingExperiences(data.data);
      } else {
        setError(data.message);
      }
    } catch {
      toast.error('Failed to fetch pending experiences');
      setError('Failed to fetch pending experiences');
    } finally {
      setLoading(false);
    }
  };

  const approveExperience = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/interview-experiences/approve/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      let data = null;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        toast.error('Unexpected response from server.');
        setError('Unexpected response from server.');
        setLoading(false);
        return;
      }

      if (data.success) {
        toast.success('Experience approved successfully');
        setSuccessMessage('Experience approved successfully');
        fetchPendingExperiences();
        fetchInterviewExperiences();
      } else {
        toast.error(data.message);
        setError(data.message);
      }
    } catch (error) {
      toast.error(`Failed to approve experience: ${error}`);
      setError(`Failed to approve experience: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (experience: InterviewExperience) => {
    if (experience.isApproved) return 'approved';
    if (experience.feedback) return 'rejected';
    return 'pending';
  };

  const rejectExperience = async (id: string) => {
    setLoading(true);
    if (!feedback.trim()) {
      setError('Feedback is required for rejection');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/interview-experiences/reject/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback, token }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Experience rejected successfully');
        setSuccessMessage('Experience rejected successfully');
        fetchPendingExperiences();
        fetchInterviewExperiences();
        setShowRejectModal(false);
        setFeedback('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      toast.error(`Failed to reject experience: ${error}`);
      setError(`Failed to reject experience: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/interview-experiences/featured/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setInterviewExperiences((prev) =>
          prev.map((exp) =>
            exp._id === id ? { ...exp, isFeatured: !exp.isFeatured } : exp
          )
        );
        setPendingExperiences((prev) =>
          prev.map((exp) =>
            exp._id === id ? { ...exp, isFeatured: !exp.isFeatured } : exp
          )
        );
        setShowDetailModal(false);
        setSelectedExperience(null);
        toast.success(data.message);
        setSuccessMessage('Featured status updated successfully');
        fetchInterviewExperiences();
      } else {
        setError(data.error || data.message);
        throw new Error(data.error || data.message);
      }
    } catch (error) {
      toast.error(`Failed to toggle featured status: ${error}`);
      setError(`Failed to toggle featured status: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/interview-experiences/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, token }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Experience deleted successfully');
        fetchInterviewExperiences();
        fetchPendingExperiences();
        setShowDeleteConfirm(false);
        toast.success('Experience deleted successfully');
      } else {
        throw new Error(data.error || data.message);
      }
    } catch (error) {
      toast.error(`Failed to delete experience: ${error}`);
      setError(`Failed to delete experience: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const getFilteredExperiences = () => {
    let experiences = interviewExperiences;

    if (activeTab === 'pending') {
      experiences = pendingExperiences;
    } else if (activeTab === 'approved') {
      experiences = interviewExperiences.filter((exp) => exp.isApproved);
    } else if (activeTab === 'rejected') {
      experiences = interviewExperiences.filter(
        (exp) => exp.isApproved === false && exp.feedback
      );
    }

    if (searchTerm) {
      experiences = experiences.filter(
        (exp) =>
          exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return experiences;
  };

  const getStatusColor = (status: string) => {
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

  const getDifficultyColor = (difficulty: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage interview experiences and user submissions
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => {
                  setActiveTab('all');
                  setSearchTerm('');
                  clearMessages();
                  toast.info(
                    'This feature is under development. Please check back later.',
                    { duration: 5000 }
                  );
                }}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Alert Messages */}
        {(error || successMessage) && (
          <div
            className={`mb-6 p-4 rounded-lg border ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}
          >
            <div className="flex justify-between items-center" ref={errorRef}>
              <span className="font-medium">
                <span>{error || successMessage}</span>
                <button
                  onClick={clearMessages}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Experiences
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {interviewExperiences.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingExperiences.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interviewExperiences.filter((exp) => exp.isApproved).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interviewExperiences.filter((exp) => exp.isFeatured).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {[
                    {
                      key: 'pending',
                      label: 'Pending',
                      count: pendingExperiences.length,
                    },
                    {
                      key: 'all',
                      label: 'All',
                      count: interviewExperiences.length,
                    },
                    {
                      key: 'approved',
                      label: 'Approved',
                      count: interviewExperiences.filter(
                        (exp) => exp.isApproved
                      ).length,
                    },
                    {
                      key: 'rejected',
                      label: 'Rejected',
                      count: interviewExperiences.filter(
                        (exp) => exp.isApproved === false && exp.feedback
                      ).length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() =>
                        setActiveTab(
                          tab.key as 'all' | 'pending' | 'approved' | 'rejected'
                        )
                      }
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.key
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by company, role, or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : getFilteredExperiences().length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No experiences found
                    </td>
                  </tr>
                ) : (
                  getFilteredExperiences().map((exp) => (
                    <tr key={exp._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {exp.isFeatured && (
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900">
                                {exp.company}
                              </p>
                              <span className="text-xs text-gray-500">•</span>
                              <p className="text-sm text-gray-700">
                                {exp.role}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {exp.jobType}
                              </span>
                              {exp.location && (
                                <>
                                  <span className="text-xs text-gray-500">
                                    •
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {exp.location}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {exp.name}
                          </p>
                          <p className="text-sm text-gray-500">{exp.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(getStatus(exp))}`}
                        >
                          {getStatus(exp).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(exp.difficultyLevel)}`}
                        >
                          {exp.difficultyLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(exp.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedExperience(exp);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {getStatus(exp) === 'pending' && (
                            <>
                              <button
                                onClick={() => approveExperience(exp._id)}
                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedExperienceId(exp._id);
                                  setShowRejectModal(true);
                                }}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {getStatus(exp) === 'approved' && (
                            <button
                              onClick={() => toggleFeatured(exp._id)}
                              className={`p-2 rounded-lg transition-colors ${
                                exp.isFeatured
                                  ? 'text-amber-600 hover:text-gray-600 hover:bg-gray-50'
                                  : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                              }`}
                              title={exp.isFeatured ? 'Unfeature' : 'Feature'}
                            >
                              {exp.isFeatured ? (
                                <StarOff className="w-4 h-4" />
                              ) : (
                                <Star className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedExperienceId(exp._id);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedExperience.company} - {selectedExperience.role}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Detailed interview experience
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

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Basic Information
                  </h4>
                  <div className="space-y-2 text-sm">
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
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">
                        {selectedExperience.location || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(selectedExperience.difficultyLevel)}`}
                      >
                        {selectedExperience.difficultyLevel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Offer Status:</span>
                      <span className="font-medium">
                        {selectedExperience.offerStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Submission Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Author:</span>
                      <span className="font-medium">
                        {selectedExperience.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">
                        {selectedExperience.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(getStatus(selectedExperience))}`}
                      >
                        {getStatus(selectedExperience)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Featured:</span>
                      <span className="font-medium">
                        {selectedExperience.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submitted:</span>
                      <span className="font-medium">
                        {formatDate(selectedExperience.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rounds:</span>
                      <span className="font-medium">
                        {selectedExperience.rounds?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {selectedExperience.tags &&
                selectedExperience.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedExperience.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Experience Content */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Detailed Experience
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedExperience.detailedExperience}
                  </p>
                </div>
              </div>

              {/* Rejection Feedback */}
              {getStatus(selectedExperience) === 'rejected' &&
                selectedExperience.feedback && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Rejection Feedback
                    </h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700">
                        {selectedExperience.feedback}
                      </p>
                    </div>
                  </div>
                )}
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedExperienceId(selectedExperience._id);
                    approveExperience(selectedExperience._id);
                    setShowDetailModal(false);
                  }}
                  variant="outline"
                  disabled={loading || selectedExperience.isApproved}
                  color="green"
                  className="flex-1"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    setSelectedExperienceId(selectedExperience._id);
                    setShowRejectModal(true);
                  }}
                  variant="outline"
                  color="red"
                  className="flex-1"
                  disabled={
                    loading || getStatus(selectedExperience) !== 'rejected'
                  }
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setSelectedExperienceId(selectedExperience._id);
                    setShowDeleteConfirm(true);
                  }}
                  variant="destructive"
                  color="red"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
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
                  <p className="text-gray-600">
                    Provide feedback for rejection
                  </p>
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
                    selectedExperienceId &&
                    rejectExperience(selectedExperienceId)
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
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
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
                    selectedExperienceId &&
                    deleteExperience(selectedExperienceId)
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
      )}
    </div>
  );
};

export default AdminDashboard;
