/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { UserProfile } from '@/models/UserProfile.models';

DB(); // initialize DB connection

export const GET = async (req: Request) => {
  try {
    // Parse query params for pagination and filtering
    const url = new URL(req.url);
    const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);
    const limit = Math.max(
      parseInt(url.searchParams.get('limit') || '20', 10),
      1
    );
    const skip = (page - 1) * limit;
    const role = url.searchParams.get('role');
    const publicProfile = url.searchParams.get('publicProfile'); // 'true' | 'false' | null

    // Build filter object - ALWAYS filter by username presence for the results list
    const filter: any = {
      username: { $exists: true, $ne: '' },
    };
    if (role) filter.role = role;
    if (publicProfile === 'true') filter.publicProfile = true;
    if (publicProfile === 'false') filter.publicProfile = false;

    // 1) Aggregation for global stats (unfiltered across all users)
    const statsAgg = await UserProfile.aggregate([
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                absoluteTotalUsers: { $sum: 1 },
                usersWithUsername: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $ne: ['$username', null] },
                          { $ne: ['$username', ''] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                publicProfiles: {
                  $sum: { $cond: [{ $eq: ['$publicProfile', true] }, 1, 0] },
                },
                privateProfiles: {
                  $sum: { $cond: [{ $eq: ['$publicProfile', false] }, 1, 0] },
                },
              },
            },
          ],
          byRole: [
            {
              $group: {
                _id: '$role',
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const totals = statsAgg?.[0]?.totals?.[0] || {
      absoluteTotalUsers: 0,
      usersWithUsername: 0,
      publicProfiles: 0,
      privateProfiles: 0,
    };
    const byRole = statsAgg?.[0]?.byRole || [];

    // 2) Paginated user list for admin table (with filtering + username requirement)
    const users = await UserProfile.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 3) Total count for pagination metadata (filtered)
    const totalUsersCount = await UserProfile.countDocuments(filter);
    const totalPages = Math.ceil(totalUsersCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json(
      {
        success: true,
        message: 'Admin stats retrieved',
        data: {
          stats: {
            totalUsers: totals.absoluteTotalUsers || 0,
            withUsername: totals.usersWithUsername || 0,
            publicProfiles: totals.publicProfiles || 0,
            privateProfiles: totals.privateProfiles || 0,
            byRole: byRole.map((r: any) => ({ role: r._id, count: r.count })),
          },
          users: {
            page,
            limit,
            total: totalUsersCount,
            totalPages,
            hasNextPage,
            hasPrevPage,
            filters: { role, publicProfile },
            results: users,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve admin stats',
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};
