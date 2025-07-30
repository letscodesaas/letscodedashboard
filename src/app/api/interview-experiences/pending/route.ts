// GET /api/interview-experiences/pending

import InterviewExperience from '@/models/InterviewExperience.Model';
import { DB } from '@/utils/db';
import { NextResponse } from 'next/server';

DB();
export async function GET() {
  try {
    const pending = await InterviewExperience.find({
      isApproved: false,
      $or: [
        { feedback: { $exists: false } },
        { feedback: "" }
      ]
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Pending interview experiences retrieved successfully',
        data: pending,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error },
      { status: 500 }
    );
  }
}
