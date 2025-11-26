/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';

const Page = () => {
    const [response, setResponse] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(20);
    const [role, setRole] = React.useState<string>('');
    const [publicProfile, setPublicProfile] = React.useState<string>('');

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

    // Responsive container and controls
    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-6 space-y-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Public Profiles Dashboard</h1>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
                <div className="flex flex-col">
                    <label htmlFor="role" className="text-sm font-medium mb-1">Role</label>
                    <select
                        id="role"
                        className="border rounded px-2 py-1"
                        value={role}
                        onChange={e => { setRole(e.target.value); setPage(1); }}
                    >
                        <option value="">All</option>
                        <option value="student">Student</option>
                        <option value="professional">Professional</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="publicProfile" className="text-sm font-medium mb-1">Public Profile</label>
                    <select
                        id="publicProfile"
                        className="border rounded px-2 py-1"
                        value={publicProfile}
                        onChange={e => { setPublicProfile(e.target.value); setPage(1); }}
                    >
                        <option value="">All</option>
                        <option value="true">Public</option>
                        <option value="false">Private</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="limit" className="text-sm font-medium mb-1">Per Page</label>
                    <select
                        id="limit"
                        className="border rounded px-2 py-1"
                        value={limit}
                        onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
                    >
                        {[10, 20, 30, 50].map((n) => (
                            <option key={n} value={n}>{n}</option>
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
                            <p className="text-3xl font-bold text-blue-600">{response.data?.stats?.totalUsers}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600">Public Profiles</p>
                            <p className="text-3xl font-bold text-green-600">{response.data?.stats?.publicProfiles}</p>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600">Complete Profiles</p>
                            <p className="text-3xl font-bold text-purple-600">{response.data?.stats?.completeProfiles}</p>
                        </div>
                        <div className="bg-orange-100 p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600">Avg Views</p>
                            <p className="text-3xl font-bold text-orange-600">{response.data?.stats?.avgViews}</p>
                        </div>
                        <div className="bg-indigo-100 p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600">Avg Points</p>
                            <p className="text-3xl font-bold text-indigo-600">{response.data?.stats?.avgPoints}</p>
                        </div>
                        <div className="bg-pink-100 p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600">% Public</p>
                            <p className="text-3xl font-bold text-pink-600">{response.data?.stats?.percentPublic?.toFixed(2)}%</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600">% Complete</p>
                            <p className="text-3xl font-bold text-yellow-600">{response.data?.stats?.percentComplete}%</p>
                        </div>
                        <div className="bg-teal-100 p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600">Public & Complete</p>
                            <p className="text-3xl font-bold text-teal-600">{response.data?.stats?.publicAndComplete}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Role Distribution */}
            {response && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">By Role</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {response.data?.stats?.byRole?.map((roleData: any, index: number) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
                                <p className="text-sm text-gray-600">Role</p>
                                <p className="text-xl font-semibold">{roleData.role || 'Not Set'}</p>
                                <p className="text-2xl font-bold text-gray-700">{roleData.count} users</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Users List & Pagination */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">
                    Users (Page {response?.data?.users?.page} of {response?.data?.users?.totalPages || 1})
                </h2>
                <p className="text-gray-600 mb-4">
                    Showing {response?.data?.users?.results?.length || 0} of {response?.data?.users?.total || 0} total users
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
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Role:</span>
                                        <span className="ml-1 font-medium">{user.role || 'N/A'}</span>
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
                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                    {user.publicProfile && user.username && (
                                        <button
                                            onClick={() => redirectToProfile(user.username)}
                                            className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded transition-colors"
                                        >
                                            View Public Profile
                                        </button>
                                    )}
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
                    <span className="px-2 text-sm">Page {page} of {response?.data?.users?.totalPages || 1}</span>
                    <button
                        className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={loading || (response && !response.data?.users?.hasNextPage)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;