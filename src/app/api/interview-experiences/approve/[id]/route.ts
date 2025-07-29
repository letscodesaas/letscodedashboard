// PATCH /api/interview-experiences/approve/:id
import InterviewExperience from '@/models/InterviewExperience.Model';
import { NextRequest, NextResponse } from 'next/server';

import { DB } from '@/utils/db';
import { isAllowed } from '@/lib/isAllowed';
DB();
// NO authentication currently, but should be added later
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }
const body = await req.json();
  const token = body.token;
  try {
    await isAllowed(token, 'admin');
    const experience = await InterviewExperience.findById(id);
    if (!experience) {
      return NextResponse.json(
        { message: 'Experience not found' },
        { status: 404 }
      );
    }
    const updated = await InterviewExperience.findByIdAndUpdate(
      id,
      { isApproved: true, feedback: '' },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json(
        { message: 'Failed to update experience' },
        { status: 500 }
      );
    }
    // sendApprovalEmail(updated.userEmail);
    return NextResponse.json(
      {
        success: true,
        message: 'Experience approved successfully',
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to approve', error },
      { status: 500 }
    );
  }
}
