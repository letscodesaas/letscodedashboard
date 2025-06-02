import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/utils/prisma';

export const POST = async (request: NextRequest) => {
  try {
    await prisma.$connect();
    const data = await request.json();
    if (!data) {
      return NextResponse.json({ message: 'EMPTY REQUEST' }, { status: 404 });
    }
    await prisma.article.update({
      where: {
        id: data.id,
      },
      data: {
        name: data?.name as string,
        content: data?.content as string,
        isPublised: data?.isPublised as boolean,
      },
    });
    return NextResponse.json({ message: 'UPDATED' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
