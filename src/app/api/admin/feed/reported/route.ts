import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { FeedPost } from '@/models/FeedPost.Model';

DB();

const PAGE_SIZE = 20;

export const GET = async (req: NextRequest) => {
  try {
    const skip = parseInt(req.nextUrl.searchParams.get('skip') ?? '0', 10);
    const total = await FeedPost.countDocuments({
      isApproved: true,
      'reports.0': { $exists: true },
    });

    const posts = await FeedPost.find({
      isApproved: true,
      'reports.0': { $exists: true },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean();

    posts.sort((a, b) => (b.reports?.length ?? 0) - (a.reports?.length ?? 0));

    return NextResponse.json({ success: true, posts, total });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
};
