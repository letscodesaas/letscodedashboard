import { NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { Questions } from '@/models/Question.Model';

DB();
export const GET = async () => {
  try {
    const currentDate = new Date().getDate();
    let currentMonth = (new Date().getMonth() + 1).toLocaleString();
    const currentYear = new Date().getFullYear();

    if(parseInt(currentMonth) < 10){
        currentMonth = "0" + currentMonth.toLocaleString()
    }

    const fullDate = currentYear+"-"+currentMonth+"-"+currentDate;

    
    const question = await Questions.findOne({
      publishingDate: fullDate.toString(),
    });
    
    if (!question) {
      return NextResponse.json({ message: 'No question' }, { status: 404 });
    }

    const info = await Questions.findOneAndUpdate(
      {
        publishingDate: fullDate.toString(),
      },
      {
        isVisible: true,
      }
    );
    console.log(info);
    return NextResponse.json({ message: 'success' });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
