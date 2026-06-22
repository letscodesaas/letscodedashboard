import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { FeedPost } from '@/models/FeedPost.Model';

DB();

const PAGE_SIZE = 20;

export const GET = async (req: NextRequest) => {
  try {
    const skip = parseInt(req.nextUrl.searchParams.get('skip') ?? '0', 10);
    const posts = await FeedPost.find({
      isApproved: true,
      reviewStatus: 'approved',
      isHidden: { $ne: true },
    })
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean();

    const total = await FeedPost.countDocuments({
      isApproved: true,
      reviewStatus: 'approved',
      isHidden: { $ne: true },
    });

    return NextResponse.json({ success: true, posts, total });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
};
