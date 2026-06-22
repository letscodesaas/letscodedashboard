import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { FeedPost } from '@/models/FeedPost.Model';

DB();

export const POST = async (req: NextRequest) => {
  try {
    const { ids, action, reason } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: 'No post IDs provided' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, message: 'Bulk action must be approve or reject' }, { status: 400 });
    }

    if (action === 'reject' && !reason?.trim()) {
      return NextResponse.json({ success: false, message: 'A reason is required for bulk reject' }, { status: 400 });
    }

    const update =
      action === 'approve'
        ? { isApproved: true, reviewStatus: 'approved', reviewedAt: new Date() }
        : { isApproved: false, reviewStatus: 'rejected', rejectionReason: reason, reviewedAt: new Date() };

    const result = await FeedPost.updateMany({ _id: { $in: ids } }, update);

    return NextResponse.json({ success: true, updated: result.modifiedCount });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
};
