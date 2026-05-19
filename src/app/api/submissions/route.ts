import { NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { Submission } from '@/models/Submission.Model';

DB();

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const date = searchParams.get('date');

    let matchStage = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);

      endDate.setDate(endDate.getDate() + 1);

      matchStage = {
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      };
    }

    const data = await Submission.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: 'contentregisters',
          localField: 'userId',
          foreignField: 'userId',
          as: 'userInfo',
        },
      },
      {
        $unwind: {
          path: '$userInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          email: '$userInfo.email',
        },
      },
      {
        $project: {
          userInfo: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return NextResponse.json(
      {
        message: 'success',
        total: data.length,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
};