/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { UserProfile } from '@/models/UserProfile.models';
import { isAllowed } from '@/lib/isAllowed';

DB();

export async function DELETE(
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

    const profile = await UserProfile.findById(id);
    if (!profile) {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      );
    }

    const deleted = await UserProfile.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: 'Failed to delete profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profile deleted successfully',
        data: deleted,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Failed to delete profile', error: error.message },
      { status: 500 }
    );
  }
}
