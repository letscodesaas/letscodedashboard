import { NextResponse } from 'next/server';

const CLERK_API = 'https://api.clerk.com/v1';

async function clerkFetch(path: string) {
  const res = await fetch(`${CLERK_API}${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Clerk API error: ${res.status}`);
  return res.json();
}

function startOf(unit: 'day' | 'week' | 'month'): number {
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
  return d.getTime();
}

export const GET = async () => {
  try {
    const [totalData, todayData, weekData, monthData] = await Promise.all([
      clerkFetch('/users/count'),
      clerkFetch(`/users/count?created_after=${startOf('day')}`),
      clerkFetch(`/users/count?created_after=${startOf('week')}`),
      clerkFetch(`/users/count?created_after=${startOf('month')}`),
    ]);

    // Fetch last 5 newest users for a "recent signups" list
    const recentUsers = await clerkFetch(
      '/users?limit=5&order_by=-created_at'
    );

    return NextResponse.json({
      success: true,
      data: {
        total: totalData.total_count,
        today: todayData.total_count,
        thisWeek: weekData.total_count,
        thisMonth: monthData.total_count,
        recent: recentUsers.map(
          (u: {
            first_name: string | null;
            last_name: string | null;
            email_addresses: { email_address: string }[];
            image_url: string;
            created_at: number;
          }) => ({
            name:
              [u.first_name, u.last_name].filter(Boolean).join(' ') ||
              'Unknown',
            email: u.email_addresses?.[0]?.email_address ?? '',
            imageUrl: u.image_url,
            createdAt: u.created_at,
          })
        ),
      },
    });
  } catch (error: unknown) {
    console.error('Clerk stats error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch Clerk stats',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};
