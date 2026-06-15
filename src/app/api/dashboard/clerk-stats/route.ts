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
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Clerk API ${res.status}: ${body}`);
  }
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

// /v1/users/count only returns total — use /v1/users with created_after for filtered counts
async function countSince(ms: number): Promise<number> {
  const data = await clerkFetch(`/users?limit=500&created_after=${ms}&order_by=-created_at`);
  return Array.isArray(data) ? data.length : 0;
}

export const GET = async () => {
  try {
    const [totalData, today, thisWeek, thisMonth, recentUsers] =
      await Promise.all([
        clerkFetch('/users/count'),
        countSince(startOf('day')),
        countSince(startOf('week')),
        countSince(startOf('month')),
        clerkFetch('/users?limit=5&order_by=-created_at'),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        total: totalData.total_count ?? 0,
        today,
        thisWeek,
        thisMonth,
        recent: (Array.isArray(recentUsers) ? recentUsers : []).map(
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
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Clerk stats error:', msg);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch Clerk stats', error: msg },
      { status: 500 }
    );
  }
};
