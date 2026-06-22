import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { FeedPost } from '@/models/FeedPost.Model';

DB();

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { pin } = await req.json();
    const { id } = params;

    if (typeof pin !== 'boolean') {
      return NextResponse.json(
        { success: false, message: '`pin` must be a boolean' },
        { status: 400 }
      );
    }

    if (pin) {
      const pinnedCount = await FeedPost.countDocuments({ isPinned: true });
      if (pinnedCount >= 3) {
        return NextResponse.json(
          { success: false, message: 'Maximum 3 posts can be pinned at once. Unpin one first.' },
          { status: 400 }
        );
      }
    }

    const post = await FeedPost.findByIdAndUpdate(
      id,
      { $set: { isPinned: pin } },
      { new: true, strict: false }
    );

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: pin ? 'Post pinned' : 'Post unpinned',
      data: { _id: post._id, isPinned: post.isPinned },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
};
