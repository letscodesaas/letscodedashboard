import InterviewExperience from '@/models/InterviewExperience.Model';
import { NextRequest, NextResponse } from 'next/server';

import { DB } from '@/utils/db';
import { isAllowed } from '@/lib/isAllowed';
DB();
// PATCH /api/interview-experiences/reject/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();
  const { feedback, token } = await body;

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }
  if (!feedback.trim()) {
    return NextResponse.json(
      { message: 'Feedback is required for rejection' },
      { status: 400 }
    );
  }

  try {
    await isAllowed(token, 'admin');
    const experience = await InterviewExperience.findById(id);
    if (!experience) {
      console.error(`Experience with ID ${id} not found`);
      return NextResponse.json(
        { message: 'Experience not found' },
        { status: 404 }
      );
    }
    const updated = await InterviewExperience.findByIdAndUpdate(
      id,
      {
        feedback,
        isApproved: false,
      },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json(
        { message: 'Failed to update experience' },
        { status: 500 }
      );
    }
    // await sendRejectionEmail(updated.userEmail, feedback);
    return NextResponse.json(
      {
        success: true,
        message: 'Experience rejected successfully',
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to reject', error },
      { status: 500 }
    );
  }
}
