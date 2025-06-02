import { NextRequest, NextResponse } from 'next/server';
import { connectNewsletterDB } from '@/utils/newsletter-db';
import { PublishNewsLetter } from '@/models/PublishNewsLetter.Model';

connectNewsletterDB(process.env.NEWLETTERDB!);
export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();
    const publishedNewsLetter = await new PublishNewsLetter(data);
    await publishedNewsLetter.save();
    return NextResponse.json({ message: 'CREATES' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'SERVER ERROR' }, { status: 500 });
  }
};
