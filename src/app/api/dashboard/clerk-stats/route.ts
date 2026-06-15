import { NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { UserProfile } from '@/models/UserProfile.models';

DB();

function startOf(unit: 'day' | 'week' | 'month'): Date {
  const d = new Date();
  if (unit === 'day') {
    d.setHours(0, 0, 0, 0);
  } else if (unit === 'week') {
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
  } else {
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
  }
  return d;
}

export const GET = async () => {
  try {
    const [total, today, thisWeek, thisMonth, recentDocs] = await Promise.all([
      UserProfile.countDocuments(),
      UserProfile.countDocuments({ createdAt: { $gte: startOf('day') } }),
      UserProfile.countDocuments({ createdAt: { $gte: startOf('week') } }),
      UserProfile.countDocuments({ createdAt: { $gte: startOf('month') } }),
      UserProfile.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstname lastname email profilePic createdAt role'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        today,
        thisWeek,
        thisMonth,
        recent: recentDocs.map((u) => ({
          name: [u.firstname, u.lastname].filter(Boolean).join(' ') || 'Unknown',
          email: u.email ?? '',
          imageUrl: u.profilePic ?? '',
          createdAt: u.createdAt,
          role: u.role ?? 'student',
        })),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('User stats error:', msg);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user stats', error: msg },
      { status: 500 }
    );
  }
};
