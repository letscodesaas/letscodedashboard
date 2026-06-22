import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { FeedPost } from '@/models/FeedPost.Model';

DB();

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { action, reason } = await req.json();
    const { id } = params;

    const validActions = ['approve', 'reject', 'make_unavailable', 'restore', 'delete'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      );
    }

    // reason is mandatory for reject, make_unavailable, delete (not for approve/restore)
    if (!['approve', 'restore'].includes(action) && !reason?.trim()) {
      return NextResponse.json(
        { success: false, message: 'A reason is required for this action' },
        { status: 400 }
      );
    }

    if (action === 'delete') {
      // Store a notification record before deleting so the user can see why
      await FeedPost.findByIdAndUpdate(id, {
        reviewStatus: 'rejected',
        isApproved: false,
        rejectionReason: reason,
        reviewedAt: new Date(),
      });
      await FeedPost.findByIdAndDelete(id);
      return NextResponse.json({ success: true, deleted: true });
    }

    const update: Record<string, unknown> = { reviewedAt: new Date() };

    if (action === 'approve' || action === 'restore') {
      update.isApproved = true;
      update.reviewStatus = 'approved';
      update.isHidden = false;
      update.hiddenReason = null;
      update.hiddenAt = null;
    } else if (action === 'reject') {
      update.isApproved = false;
      update.reviewStatus = 'rejected';
      update.rejectionReason = reason;
    } else if (action === 'make_unavailable') {
      // Keep reviewStatus approved but hide from feed; user sees reason
      update.isHidden = true;
      update.hiddenReason = reason;
      update.hiddenAt = new Date();
    }

    const post = await FeedPost.findByIdAndUpdate(id, update, { new: true });
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
};
