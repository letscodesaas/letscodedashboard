import { NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { Questions } from '@/models/Question.Model';

export const revalidate = 0;

DB();
export const GET = async () => {
  try {
    const currentDate = new Date().getDate();
    let currentMonth = (new Date().getMonth() + 1).toLocaleString();
    const currentYear = new Date().getFullYear();

    if (parseInt(currentMonth) < 10) {
      currentMonth = '0' + currentMonth.toLocaleString();
    }

    const fullDate = currentYear + '-' + currentMonth + '-' + currentDate;
    console.log(fullDate);

    const question = await Questions.findOne({
      // @ts-ignore
      publishingDate: fullDate.toString(),
    });

    console.log(question);
    if (!question) {
      console.log('question not found');
      return NextResponse.json(
        { message: 'question not found' },
        { status: 404 }
      );
    }

    // @ts-ignore
    const info = await Questions.findOneAndUpdate(
      {
        publishingDate: fullDate.toString(),
      },
      {
        isVisible: true,
      }
    );
    //   @ts-ignore
    if (!info?.isVisible) {
      console.log('Re run');
      //   @ts-ignore
      await Questions.findOneAndUpdate(
        {
          publishingDate: fullDate.toString(),
        },
        {
          isVisible: true,
        }
      );
    }
    console.log('cron run');
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    throw new Error(String(error));
  }
};
