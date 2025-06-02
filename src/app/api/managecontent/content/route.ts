import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export const POST = async (request: NextRequest) => {
  try {
    await prisma.$connect();
    const data = await request.json();
    if (!data) {
      return NextResponse.json({ message: 'EMPTY REQUEST' }, { status: 404 });
    }
    const content = await prisma.article.findFirst({
      where: {
        id: data.id,
      },
    });
    if (!content) {
      return NextResponse.json({ message: 'NOT FOUND' }, { status: 404 });
    }
    return NextResponse.json({ message: content

     }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
