/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react'

const Page = () => {
    const [response, setResponse] = React.useState<any>(null);

    React.useEffect(() => {
        fetch('/api/public-profile')
            .then((res) => res.json())
            .then((data) => setResponse(data))
            .catch((error) => console.error('Error fetching public profiles:', error));
    }, []);

    const redirectToProfile = (userId: string) => {
        // new tab 
        window.open(`https://www.lets-code.co.in/u/${userId}`, '_blank');
    };
    return (
        <div className="container mx-auto p-6 space-y-6">
            {response ? (
                <div>
                    <h1 className="text-3xl font-bold mb-6">Public Profiles Dashboard</h1>

                    {/* Stats Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                    {/* Role Distribution */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">By Role</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {response.data?.stats?.byRole?.map((roleData: any, index: number) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
                                    <p className="text-sm text-gray-600">Role</p>
                                    <p className="text-xl font-semibold">{roleData.role || 'Not Set'}</p>
                                    <p className="text-2xl font-bold text-gray-700">{roleData.count} users</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Users List */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">
                            Users (Page {response.data?.users?.page} of {Math.ceil(response.data?.users?.total / response.data?.users?.limit)})
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Showing {response.data?.users?.results?.length} of {response.data?.users?.total} total users
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {response.data?.users?.results?.map((user: any) => (
                                <div key={user._id} className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-4">
                                        {user.profilePic && (
                                            <img
                                                src={user.profilePic}
                                                alt="Profile"
                                                width={64}
                                                height={64}
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
                                            <span className={`px-2 py-1 rounded text-xs ${user.publicProfile ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
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
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-64">
                    <p className="text-xl text-gray-500">Loading...</p>
                </div>
            )}
        </div>
    )
}

export default Page

/*
{"success":true,"message":"Admin stats retrieved","data":{"stats":{"totalUsers":58,"completeProfiles":0,"publicProfiles":14,"publicAndComplete":0,"percentComplete":0,"percentPublic":24.14,"avgPoints":0,"avgViews":2,"byRole":[{"role":null,"count":16},{"role":"student","count":42}]},"users":{"page":1,"limit":20,"total":58,"results":[{"_id":"6914b23c8dac351a5de03ec7","createdAt":"2025-11-12T16:13:48.454Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":true,"role":"student","views":6,"firstname":"BODDEPALLI","lastname":"USHAKIRAN","username":"ushakiran_1729"},{"_id":"690a28d2c86bc1c133bd3d8a","createdAt":"2025-11-04T16:24:50.258Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":false,"role":"student","username":"itsyourap","views":0},{"_id":"6904ca25c86bc1c1337f1a28","createdAt":"2025-10-31T14:39:33.242Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":true,"role":"student","views":0},{"_id":"6900671dc86bc1c1336e29c3","createdAt":"2025-10-28T06:47:56.928Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":true,"role":"student","views":0,"firstname":"Vaishnavi ","lastname":"Kokare"},{"_id":"68f8e095be73ddb6a42f2252","createdAt":"2025-10-22T13:48:05.559Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":true,"role":"student","views":0},{"_id":"68e11fe5ed252f83481b3a4b","createdAt":"2025-10-04T13:23:48.147Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"profilePic":"https://res.cloudinary.com/dvyd7dtn0/image/upload/v1759584227/WhatsApp_Image_2025-09-21_at_20.14.17_215b4c95_zlv06w.jpg","publicProfile":true,"role":"student","views":0,"firstname":"MD AATIF","lastname":"HUSSAIN"},{"_id":"68d68081ed252f8348078594","createdAt":"2025-09-26T12:01:05.465Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":false,"role":"student","views":0},{"_id":"68c1227685cb743448a41e8f","createdAt":"2025-09-10T07:02:14.608Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":false,"role":"student","views":0},{"_id":"68c1217a85cb743448a41be0","createdAt":"2025-09-10T06:58:02.770Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":true,"role":"student","views":0},{"_id":"68b9146785cb7434489977a3","createdAt":"2025-09-04T04:24:07.484Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":true,"role":"student","views":0,"firstname":"Mayur","lastname":"Sonawane"},{"_id":"68b89b9b85cb743448990718","createdAt":"2025-09-03T19:48:43.190Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":false,"role":"student","views":0},{"_id":"68b664e786bc2651bf8f7d50","createdAt":"2025-09-02T03:30:47.672Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":false,"role":"student","views":0},{"_id":"68b6561e86bc2651bf8f6a82","createdAt":"2025-09-02T02:27:42.135Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":true,"role":"student","views":0,"firstname":"Kanishkaa","lastname":"M"},{"_id":"68b5596686bc2651bf8e8214","createdAt":"2025-09-01T08:29:26.372Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":false,"role":"student","username":"hackedrishi","views":0},{"_id":"68aff4c286bc2651bf888d3d","createdAt":"2025-08-28T06:18:42.880Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":true,"role":"student","views":0},{"_id":"68ab17aa7551722414d375b4","createdAt":"2025-08-24T13:46:18.052Z","isProfileComplete":false,"isProfilePublic":false,"points":0,"publicProfile":true,"role":"student","views":0},{"_id":"68a6b4597babc72e665a2ec9","email":"koushil463@gmail.com","role":"student","profilePic":"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zMWFJOE5JdGFpakxGRzBxbVpEMEJqMWJzdGgifQ","isProfileComplete":false,"isProfilePublic":false,"publicProfile":true,"points":0,"views":0,"createdAt":"2025-08-21T05:53:29.262Z","username":"koushil369"},{"_id":"68a5fc2f6e3437b5a3f41504","email":"sheetalchouhan291202@gmail.com","role":"student","profilePic":"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zMVlrWWRJa3hUOFVtWGVxNVhZVm1tM2lyRTkifQ","isProfileComplete":false,"isProfilePublic":false,"publicProfile":false,"points":0,"views":0,"createdAt":"2025-08-20T16:47:43.302Z"},{"_id":"68a5aca73c4f2e774539ac3b","email":"surabhib0909@gmail.com","role":"student","profilePic":"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zMVk0a2tLU01lZGlMV1JjUGRscjZQYk1wYkoifQ","isProfileComplete":false,"isProfilePublic":false,"publicProfile":false,"points":0,"views":0,"createdAt":"2025-08-20T11:08:23.648Z"},{"_id":"68a5255f4544b7991497cbed","email":"twingletom@gmail.com","role":"student","profilePic":"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zMVd2MjZreEU2cDZ4S1dxc2VFNzlFVWtwNWQifQ","isProfileComplete":false,"isProfilePublic":false,"publicProfile":false,"points":0,"views":0,"createdAt":"2025-08-20T01:31:11.729Z"}]}}}
*/