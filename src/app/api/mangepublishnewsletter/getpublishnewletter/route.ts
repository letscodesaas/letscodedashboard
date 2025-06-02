import { NextResponse } from 'next/server';
import { connectNewsletterDB } from '@/utils/newsletter-db';
import { PublishNewsLetter } from '@/models/PublishNewsLetter.Model';
connectNewsletterDB(process.env.NEWLETTERDB!);
export const GET = async () => {
  try {
    const data = await PublishNewsLetter.find({});
    return NextResponse.json({ message: data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'SERVER ERROR' }, { status: 500 });
  }
};
