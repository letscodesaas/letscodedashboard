import InterviewExperience from '@/models/InterviewExperience.Model';
import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/utils/db';
DB();
export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }
  try {
    const experience = await InterviewExperience.findById(id);
    if (!experience) {
      return NextResponse.json(
        { message: 'Experience not found' },
        { status: 404 }
      );
    }
    const isFeatured = experience.isFeatured;
    const updated = await InterviewExperience.findByIdAndUpdate(
      id,
      { isFeatured: !isFeatured },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json(
        { message: 'Failed to toggle feature status' },
        { status: 500 }
      );
    }
    // sendApprovalEmail(updated.userEmail);
    return NextResponse.json(
      {
        success: true,
        message: `Experience ${isFeatured ? 'unfeatured' : 'featured'} successfully`,
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to toggle feature status', error },
      { status: 500 }
    );
  }
};
