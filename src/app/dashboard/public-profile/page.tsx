/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';
import { Trash2 } from 'lucide-react';

const Page = () => {
  const { token } = useAuth();
  const [response, setResponse] = React.useState<any>(null);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [role, setRole] = React.useState<string>('');
  const [publicProfile, setPublicProfile] = React.useState<string>('');
  const [deleteTarget, setDeleteTarget] = React.useState<any>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const fetchProfiles = React.useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(role ? { role } : {}),
      ...(publicProfile ? { publicProfile } : {}),
    });
    fetch(`/api/public-profile?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setResponse(data))
      .catch((error) => {
        setResponse(null);
        console.error('Error fetching public profiles:', error);
      })
      .finally(() => setLoading(false));
  }, [page, limit, role, publicProfile]);

  React.useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const redirectToProfile = (userId: string) => {
    window.open(`https://www.lets-code.co.in/u/${userId}`, '_blank');
  };

  const deleteProfile = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/public-profile/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setDeleteTarget(null);
        fetchProfiles();
      } else {
        alert(data.message || 'Failed to delete profile');
      }
    } catch {
      alert('Failed to delete profile');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Lazy load modal to avoid SSR issues
  const ProfileDetailsModal = React.useMemo(
    () => dynamic(() => import('./ProfileDetailsModal'), { ssr: false }),
    []
  );

  // Responsive container and controls
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Public Profiles Dashboard
      </h1>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="role" className="text-sm font-medium mb-1">
            Role
          </label>
          <select
            id="role"
            className="border rounded px-2 py-1"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            <option value="student">Student</option>
            <option value="professional">Professional</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="publicProfile" className="text-sm font-medium mb-1">
            Public Profile
          </label>
          <select
            id="publicProfile"
            className="border rounded px-2 py-1"
            value={publicProfile}
            onChange={(e) => {
              setPublicProfile(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            <option value="true">Public</option>
            <option value="false">Private</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="limit" className="text-sm font-medium mb-1">
            Per Page
          </label>
          <select
            id="limit"
            className="border rounded px-2 py-1"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Section */}
      {response && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">
                {response.data?.stats?.totalUsers}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Public Profiles</p>
              <p className="text-3xl font-bold text-green-600">
                {response.data?.stats?.publicProfiles}
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Complete Profiles</p>
              <p className="text-3xl font-bold text-purple-600">
                {response.data?.stats?.completeProfiles}
              </p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Avg Views</p>
              <p className="text-3xl font-bold text-orange-600">
                {response.data?.stats?.avgViews}
              </p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Avg Points</p>
              <p className="text-3xl font-bold text-indigo-600">
                {response.data?.stats?.avgPoints}
              </p>
            </div>
            <div className="bg-pink-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">% Public</p>
              <p className="text-3xl font-bold text-pink-600">
                {response.data?.stats?.percentPublic?.toFixed(2)}%
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">% Complete</p>
              <p className="text-3xl font-bold text-yellow-600">
                {response.data?.stats?.percentComplete}%
              </p>
            </div>
            <div className="bg-teal-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Public & Complete</p>
              <p className="text-3xl font-bold text-teal-600">
                {response.data?.stats?.publicAndComplete}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Role Distribution */}
      {response && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">By Role</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {response.data?.stats?.byRole?.map(
              (roleData: any, index: number) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-xl font-semibold">
                    {roleData.role || 'Not Set'}
                  </p>
                  <p className="text-2xl font-bold text-gray-700">
                    {roleData.count} users
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Profile
              </h3>
            </div>
            <p className="text-gray-700 mb-2">
              Are you sure you want to permanently delete the profile of{' '}
              <span className="font-semibold">
                {deleteTarget.firstname && deleteTarget.lastname
                  ? `${deleteTarget.firstname} ${deleteTarget.lastname}`
                  : deleteTarget.username || 'this user'}
              </span>
              ?
            </p>
            <p className="text-sm text-red-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteProfile}
                disabled={deleteLoading}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <ProfileDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      {/* Users List & Pagination */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Users (Page {response?.data?.users?.page} of{' '}
          {response?.data?.users?.totalPages || 1})
        </h2>
        <p className="text-gray-600 mb-4">
          Showing {response?.data?.users?.results?.length || 0} of{' '}
          {response?.data?.users?.total || 0} total users
        </p>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-xl text-gray-500 animate-pulse">Loading...</p>
          </div>
        ) : response?.data?.users?.results?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {response.data.users.results.map((user: any) => (
              <div
                key={user._id}
                className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  {user.profilePic && (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {user.firstname && user.lastname
                        ? `${user.firstname} ${user.lastname}`
                        : user.username || 'No Name'}
                    </h3>
                    {user.username && (
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    )}
                    {user.email && (
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Role:</span>
                    <span className="ml-1 font-medium">
                      {user.role || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Points:</span>
                    <span className="ml-1 font-medium">{user.points}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Views:</span>
                    <span className="ml-1 font-medium">{user.views}</span>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${user.publicProfile ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {user.publicProfile ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500">
                    Joined:{' '}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 px-4 rounded transition-colors"
                    >
                      View Details
                    </button>
                    {user.publicProfile && user.username && (
                      <button
                        onClick={() => redirectToProfile(user.username)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded transition-colors"
                      >
                        View Public Profile
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteTarget(user)}
                      className="w-full bg-red-100 hover:bg-red-200 text-red-700 text-sm py-2 px-4 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-xl text-gray-400">No users found.</p>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            Previous
          </button>
          <span className="px-2 text-sm">
            Page {page} of {response?.data?.users?.totalPages || 1}
          </span>
          <button
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={
              loading || (response && !response.data?.users?.hasNextPage)
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
