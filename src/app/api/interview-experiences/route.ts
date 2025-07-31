// GET all interview experiences
import InterviewExperience from '@/models/InterviewExperience.Model';
import { DB } from '@/utils/db';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

DB();
export const GET = async () => {
  try {
    const experiences = await InterviewExperience.find().sort({
      createdAt: -1,
    });
    return NextResponse.json(
      {
        success: true,
        message: 'Interview experiences retrieved successfully',
        data: experiences,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching interview experiences:', error);
    return NextResponse.json(
      { message: 'Failed to fetch experiences', error },
      { status: 500 }
    );
  }
};
