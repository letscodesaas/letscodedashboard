import { NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { Submission } from '@/models/Submission.Model';

DB();
export const GET = async () => {
  try {
    const data = await Submission.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({ message: 'success', data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
