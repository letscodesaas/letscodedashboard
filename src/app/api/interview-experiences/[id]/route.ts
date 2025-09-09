/* eslint-disable @typescript-eslint/no-explicit-any */
// DELETE /api/interview-experiences/:id
import InterviewExperience from '@/models/InterviewExperience.Model';
import { NextRequest, NextResponse } from 'next/server';

import { DB } from '@/utils/db';
import { isAllowed } from '@/lib/isAllowed';

DB();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    return NextResponse.json(
      {
        success: true,
        message: 'Experience retrieved successfully',
        data: experience,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }
  // Check if the request body has a valid token
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
    const deleted = await InterviewExperience.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: 'Failed to delete experience' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: 'Experience deleted successfully',
        data: deleted,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete experience: ', error: error.message },
      { status: 500 }
    );
  }
}

// Edit an existing interview experience
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    // Check if the request headers have a valid token
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      );
    }
    await isAllowed(token, 'admin');

    // Validate fields
    const validationError = validateExperience(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    // Check if the experience exists
    const experience = await InterviewExperience.findOne({
      _id: id,
    });
    if (!experience) {
      return NextResponse.json(
        { error: 'Interview experience not found' },
        { status: 404 }
      );
    }
    // Update the experience
    experience.name = body.name;
    experience.email = body.email;
    experience.company = body.company;
    experience.role = body.role;
    experience.jobType = body.jobType;
    experience.location = body.location || '';
    experience.interviewDate = body.interviewDate || null;
    experience.graduationYear = body.graduationYear || null;
    experience.collegeName = body.collegeName || '';
    experience.currentStatus = body.currentStatus || '';
    experience.currentRole = body.currentRole || '';
    experience.duration = body.duration || '';
    experience.packageCTC = body.packageCTC || '';
    experience.resumeLink = body.resumeLink || '';
    experience.linkedIn = body.linkedIn || '';
    experience.github = body.github || '';
    experience.resourcesUsed = body.resourcesUsed || [];
    experience.technologies = body.technologies || [];
    experience.rounds = body.rounds;
    experience.roundsCount = body.rounds?.length || 0;
    experience.detailedExperience = body.detailedExperience;
    experience.difficultyLevel = body.difficultyLevel || 'Medium';
    experience.tags = body.tags || [];
    experience.offerStatus = body.offerStatus;
    experience.isAnonymous = body.isAnonymous || false;
    experience.isApproved = false; // Reset approval status on edit
    experience.isFeatured = false; // Reset featured status on edit
    experience.feedback = ''; // Reset feedback on edit

    const updatedExperience = await experience.save();

    return NextResponse.json(
      {
        message: 'Interview experience updated successfully',
        data: updatedExperience,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT /api/interview-experience error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};

// --- Enum Validations ---
const VALID_JOB_TYPES = [
  'Internship',
  'Full-Time',
  'PPO',
  'On-Campus',
  'Off-Campus',
  'Referral',
];
const VALID_DIFFICULTY = ['Easy', 'Medium', 'Hard'];
const VALID_STATUS = ['Selected', 'Rejected', 'Waiting for Results'];

// --- Field Validation Utility ---
export const validateExperience = (data: any): string | null => {
  const requiredFields = [
    'company',
    'role',
    'jobType',
    'detailedExperience',
    'rounds',
    'offerStatus',
    'currentStatus',
  ];

  for (const field of requiredFields) {
    if (
      !data[field] ||
      (Array.isArray(data[field]) && data[field].length === 0)
    ) {
      return `${field} is required`;
    }
  }

  if (!VALID_JOB_TYPES.includes(data.jobType)) return 'Invalid jobType';
  if (data.difficultyLevel && !VALID_DIFFICULTY.includes(data.difficultyLevel))
    return 'Invalid difficultyLevel';
  if (!VALID_STATUS.includes(data.offerStatus)) return 'Invalid offerStatus';
  if (!data.currentStatus) return 'currentStatus is required';

  return null;
};
