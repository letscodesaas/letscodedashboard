import { NextResponse,NextRequest } from 'next/server';
import { connectNewsletterDB } from '@/utils/newsletter-db';
import { PublishNewsLetter } from '@/models/PublishNewsLetter.Model';
connectNewsletterDB(process.env.NEWLETTERDB!);
export const POST = async (request:NextRequest) => {
  try {
    const data = await request.json();
    const info = await PublishNewsLetter.findById(data.id)
    return NextResponse.json({ message: info }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'SERVER ERROR' }, { status: 500 });
  }
};
