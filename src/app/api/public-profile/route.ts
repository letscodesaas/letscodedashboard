/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { UserProfile } from '@/models/UserProfile.models';

DB(); // initialize DB connection

export const GET = async (req: Request) => {
  try {
    // read pagination from querystring (optional)
    const url = new URL(req.url);
    const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);
    const limit = Math.max(
      parseInt(url.searchParams.get('limit') || '20', 10),
      1
    );
    const skip = (page - 1) * limit;

    // 1) Aggregation for global stats
    const statsAgg = await UserProfile.aggregate([
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                completeProfiles: {
                  $sum: {
                    $cond: [{ $eq: ['$isProfileComplete', true] }, 1, 0],
                  },
                },
                publicProfiles: {
                  $sum: { $cond: [{ $eq: ['$publicProfile', true] }, 1, 0] },
                },
                publicAndComplete: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$publicProfile', true] },
                          { $eq: ['$isProfileComplete', true] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                totalPoints: { $sum: { $ifNull: ['$points', 0] } },
                totalViews: { $sum: { $ifNull: ['$views', 0] } },
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
      totalUsers: 0,
      completeProfiles: 0,
      publicProfiles: 0,
      publicAndComplete: 0,
      totalPoints: 0,
      totalViews: 0,
    };
    const byRole = statsAgg?.[0]?.byRole || [];

    // compute derived metrics safely
    const percentComplete = totals.totalUsers
      ? Math.round((totals.completeProfiles / totals.totalUsers) * 100 * 100) /
        100
      : 0;
    const percentPublic = totals.totalUsers
      ? Math.round((totals.publicProfiles / totals.totalUsers) * 100 * 100) /
        100
      : 0;
    const avgPoints = totals.totalUsers
      ? totals.totalPoints / totals.totalUsers
      : 0;
    const avgViews = totals.totalUsers
      ? totals.totalViews / totals.totalUsers
      : 0;

    // 2) Paginated user list for admin table (selecting only required fields)
    const users = await UserProfile.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        'username email firstname lastname role isProfileComplete publicProfile isProfilePublic points views createdAt profilePic'
      )
      .lean();

    // 3) Total count for pagination metadata
    const totalUsersCount =
      totals.totalUsers || (await UserProfile.countDocuments());

    return NextResponse.json(
      {
        success: true,
        message: 'Admin stats retrieved',
        data: {
          stats: {
            totalUsers: totals.totalUsers || 0,
            completeProfiles: totals.completeProfiles || 0,
            publicProfiles: totals.publicProfiles || 0,
            publicAndComplete: totals.publicAndComplete || 0,
            percentComplete,
            percentPublic,
            avgPoints: Number(avgPoints.toFixed(2)),
            avgViews: Number(avgViews.toFixed(2)),
            byRole: byRole.map((r: any) => ({ role: r._id, count: r.count })),
          },
          users: {
            page,
            limit,
            total: totalUsersCount,
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
