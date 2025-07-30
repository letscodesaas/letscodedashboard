/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Eye,
  Check,
  X,
  Star,
  Trash2,
  Building2,
  Clock,
  CheckCircle,
  StarOff,
  Filter,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calendar,
  MapPin,
  GraduationCap,
  DollarSign,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InterviewExperience } from '../../../../types/interview';
import { toast, Toaster } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  formatDate,
  getDifficultyColor,
  getStatus,
  getStatusColor,
  getOfferStatusColor,
} from './helper';
import {
  DeleteConfirmationModal,
  DetailModal,
  RejectionModal,
} from './DetailModel';

interface FilterState {
  jobType: string;
  difficultyLevel: string;
  offerStatus: string;
  status: string;
  dateRange: string;
  isAnonymous: string;
}

interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

const ITEMS_PER_PAGE = 10;

const InterviewExperience = () => {
  // Data state
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
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);

  const { token } = useAuth();

  // UI State
  const [activeTab, setActiveTab] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperience, setSelectedExperience] =
    useState<InterviewExperience | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort state
  const [filters, setFilters] = useState<FilterState>({
    jobType: '',
    difficultyLevel: '',
    offerStatus: '',
    status: '',
    dateRange: '',
    isAnonymous: '',
  });

  const [sortState, setSortState] = useState<SortState>({
    field: 'createdAt',
    direction: 'desc',
  });

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    await Promise.all([fetchInterviewExperiences(), fetchPendingExperiences()]);
  }, []);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  // API functions
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
    }
  };

  const approveExperience = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/interview-experiences/approve/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Unexpected response from server');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Experience approved successfully');
        setSuccessMessage('Experience approved successfully');
        await fetchData();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error(`Failed to approve experience: ${error.message}`);
      setError(`Failed to approve experience: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback, token }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Experience rejected successfully');
        setSuccessMessage('Experience rejected successfully');
        await fetchData();
        setShowRejectModal(false);
        setFeedback('');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error(`Failed to reject experience: ${error.message}`);
      setError(`Failed to reject experience: ${error.message}`);
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setSuccessMessage('Featured status updated successfully');
        await fetchData();
        setShowDetailModal(false);
        setSelectedExperience(null);
      } else {
        throw new Error(data.error || data.message);
      }
    } catch (error: any) {
      toast.error(`Failed to toggle featured status: ${error.message}`);
      setError(`Failed to toggle featured status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/interview-experiences/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Experience deleted successfully');
        await fetchData();
        setShowDeleteConfirm(false);
        toast.success('Experience deleted successfully');
      } else {
        throw new Error(data.error || data.message);
      }
    } catch (error: any) {
      toast.error(`Failed to delete experience: ${error.message}`);
      setError(`Failed to delete experience: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Bulk operations
  const bulkApprove = async () => {
    if (selectedExperiences.length === 0) return;
    setLoading(true);
    try {
      await Promise.all(selectedExperiences.map((id) => approveExperience(id)));
      setSelectedExperiences([]);
      toast.success(`${selectedExperiences.length} experiences approved`);
    } catch (error: any) {
      toast.error(`Failed to approve some experiences: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const bulkDelete = async () => {
    if (selectedExperiences.length === 0) return;
    setLoading(true);
    try {
      await Promise.all(selectedExperiences.map((id) => deleteExperience(id)));
      setSelectedExperiences([]);
      toast.success(`${selectedExperiences.length} experiences deleted`);
    } catch (error: any) {
      toast.error(`Failed to delete some experiences: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredAndSortedExperiences = useMemo(() => {
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

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      experiences = experiences.filter(
        (exp) =>
          exp.company.toLowerCase().includes(term) ||
          exp.role.toLowerCase().includes(term) ||
          exp.name.toLowerCase().includes(term) ||
          exp.email?.toLowerCase().includes(term) ||
          exp.collegeName?.toLowerCase().includes(term) ||
          exp.location?.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.jobType) {
      experiences = experiences.filter(
        (exp) => exp.jobType === filters.jobType
      );
    }
    if (filters.difficultyLevel) {
      experiences = experiences.filter(
        (exp) => exp.difficultyLevel === filters.difficultyLevel
      );
    }
    if (filters.offerStatus) {
      experiences = experiences.filter(
        (exp) => exp.offerStatus === filters.offerStatus
      );
    }
    if (filters.isAnonymous) {
      const isAnon = filters.isAnonymous === 'true';
      experiences = experiences.filter((exp) => exp.isAnonymous === isAnon);
    }

    // Apply sorting
    experiences.sort((a, b) => {
      let aValue: any = a[sortState.field as keyof InterviewExperience];
      let bValue: any = b[sortState.field as keyof InterviewExperience];

      if (sortState.field === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortState.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortState.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return experiences;
  }, [
    interviewExperiences,
    pendingExperiences,
    activeTab,
    searchTerm,
    filters,
    sortState,
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedExperiences.length / ITEMS_PER_PAGE
  );
  const paginatedExperiences = filteredAndSortedExperiences.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Statistics
  const stats = useMemo(() => {
    const total = interviewExperiences.length;
    const pending = pendingExperiences.length;
    const approved = interviewExperiences.filter(
      (exp) => exp.isApproved
    ).length;
    const featured = interviewExperiences.filter(
      (exp) => exp.isFeatured
    ).length;
    const rejected = interviewExperiences.filter(
      (exp) => exp.isApproved === false && exp.feedback
    ).length;
    const thisMonth = interviewExperiences.filter(
      (exp) => new Date(exp.createdAt).getMonth() === new Date().getMonth()
    ).length;

    return { total, pending, approved, featured, rejected, thisMonth };
  }, [interviewExperiences, pendingExperiences]);

  const handleSort = (field: string) => {
    setSortState((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedExperiences(paginatedExperiences.map((exp) => exp._id));
    } else {
      setSelectedExperiences([]);
    }
  };

  const handleSelectExperience = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedExperiences((prev) => [...prev, id]);
    } else {
      setSelectedExperiences((prev) => prev.filter((expId) => expId !== id));
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const exportData = () => {
    const csvContent = [
      [
        'Company',
        'Role',
        'Author',
        'Email',
        'Job Type',
        'Difficulty',
        'Offer Status',
        'Location',
        'College',
        'Graduation Year',
        'Package',
        'Status',
        'Featured',
        'Anonymous',
        'Created At',
      ],
      ...filteredAndSortedExperiences.map((exp) => [
        exp.company,
        exp.role,
        exp.name,
        exp.email || '',
        exp.jobType,
        exp.difficultyLevel,
        exp.offerStatus,
        exp.location || '',
        exp.collegeName || '',
        exp.graduationYear || '',
        exp.packageCTC || '',
        getStatus(exp),
        exp.isFeatured ? 'Yes' : 'No',
        exp.isAnonymous ? 'Yes' : 'No',
        formatDate(exp.createdAt),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-experiences-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Interview Experiences
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and review interview experiences shared by users.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => fetchData()}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              <Button onClick={exportData} className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Alert Messages */}
        {(error || successMessage) && (
          <div
            className={`mb-6 p-4 rounded-lg border flex justify-between items-center ${
              error
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-green-50 border-green-200 text-green-700'
            }`}
          >
            <span className="font-medium">{error || successMessage}</span>
            <button
              onClick={clearMessages}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Approved</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.approved}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Featured</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.featured}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Rejected</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">This Month</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.thisMonth}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200">
          {/* Tabs, Search, and Filters */}
          <div className="border-b border-gray-200">
            <div className="p-6">
              <div className="flex flex-col gap-4">
                {/* Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    {[
                      {
                        key: 'pending',
                        label: 'Pending',
                        count: stats.pending,
                      },
                      { key: 'all', label: 'All', count: stats.total },
                      {
                        key: 'approved',
                        label: 'Approved',
                        count: stats.approved,
                      },
                      {
                        key: 'rejected',
                        label: 'Rejected',
                        count: stats.rejected,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => {
                          setActiveTab(tab.key as any);
                          setCurrentPage(1);
                        }}
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

                  {/* Bulk Actions */}
                  {selectedExperiences.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {selectedExperiences.length} selected
                      </span>
                      <Button
                        size="sm"
                        onClick={bulkApprove}
                        disabled={loading}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={bulkDelete}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>

                {/* Search and Filter Controls */}
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by company, role, author, email, college..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                    <select
                      value={filters.jobType}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          jobType: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Job Types</option>
                      <option value="Internship">Internship</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="PPO">PPO</option>
                      <option value="On-Campus">On-Campus</option>
                      <option value="Off-Campus">Off-Campus</option>
                      <option value="Referral">Referral</option>
                    </select>

                    <select
                      value={filters.difficultyLevel}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          difficultyLevel: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>

                    <select
                      value={filters.offerStatus}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          offerStatus: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Offer Status</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Waiting for Results">
                        Waiting for Results
                      </option>
                    </select>

                    <select
                      value={filters.isAnonymous}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          isAnonymous: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Submissions</option>
                      <option value="false">Named</option>
                      <option value="true">Anonymous</option>
                    </select>

                    <Button
                      variant="outline"
                      onClick={() =>
                        setFilters({
                          jobType: '',
                          difficultyLevel: '',
                          offerStatus: '',
                          status: '',
                          dateRange: '',
                          isAnonymous: '',
                        })
                      }
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        paginatedExperiences.length > 0 &&
                        selectedExperiences.length ===
                          paginatedExperiences.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('company')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Experience
                      {sortState.field === 'company' &&
                        (sortState.direction === 'asc' ? (
                          <SortAsc className="w-3 h-3" />
                        ) : (
                          <SortDesc className="w-3 h-3" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Author
                      {sortState.field === 'name' &&
                        (sortState.direction === 'asc' ? (
                          <SortAsc className="w-3 h-3" />
                        ) : (
                          <SortDesc className="w-3 h-3" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Date
                      {sortState.field === 'createdAt' &&
                        (sortState.direction === 'asc' ? (
                          <SortAsc className="w-3 h-3" />
                        ) : (
                          <SortDesc className="w-3 h-3" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : paginatedExperiences.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No experiences found
                    </td>
                  </tr>
                ) : (
                  paginatedExperiences.map((exp) => (
                    <tr key={exp._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedExperiences.includes(exp._id)}
                          onChange={(e) =>
                            handleSelectExperience(exp._id, e.target.checked)
                          }
                          className="rounded border-gray-300"
                        />
                      </td>
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
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
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
                            {exp.isAnonymous ? 'Anonymous' : exp.name}
                          </p>
                          {!exp.isAnonymous && exp.email && (
                            <p className="text-sm text-gray-500">{exp.email}</p>
                          )}
                          {exp.collegeName && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <GraduationCap className="w-3 h-3" />
                              {exp.collegeName}
                              {exp.graduationYear && ` '${exp.graduationYear}`}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(exp.difficultyLevel)}`}
                          >
                            {exp.difficultyLevel}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getOfferStatusColor(exp.offerStatus)}`}
                          >
                            {exp.offerStatus}
                          </span>
                          {exp.packageCTC && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {exp.packageCTC}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(getStatus(exp))}`}
                          >
                            {getStatus(exp).toUpperCase()}
                          </span>
                          {exp.isAnonymous && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                              Anonymous
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(exp.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
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
                                disabled={loading}
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
                              disabled={loading}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredAndSortedExperiences.length
                  )}{' '}
                  of {filteredAndSortedExperiences.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm rounded ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <span className="text-gray-500">...</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && selectedExperience && (
        <DetailModal
          selectedExperience={selectedExperience}
          setShowDetailModal={setShowDetailModal}
          setSelectedExperienceId={setSelectedExperienceId}
          approveExperience={approveExperience}
          loading={loading}
          setShowDeleteConfirm={setShowDeleteConfirm}
          setShowRejectModal={setShowRejectModal}
        />
      )}

      {showRejectModal && (
        <RejectionModal
          selectedExperienceId={selectedExperienceId}
          setShowRejectModal={setShowRejectModal}
          rejectExperience={rejectExperience}
          loading={loading}
          feedback={feedback}
          setFeedback={setFeedback}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmationModal
          selectedExperienceId={selectedExperienceId}
          setShowDeleteConfirm={setShowDeleteConfirm}
          deleteExperience={deleteExperience}
          loading={loading}
        />
      )}
    </div>
  );
};

export default InterviewExperience;
