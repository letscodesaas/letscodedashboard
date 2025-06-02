import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/utils/prisma';

export const POST = async (request: NextRequest) => {
  try {
    await prisma.$connect();
    const data = await request.json();
    if (!data) {
      return NextResponse.json({ message: 'EMPTY REQUEST' }, { status: 404 });
    }
    await prisma.article.delete({
      where: {
        id: data.id,
      },
    });
    return NextResponse.json({ message: 'DELETED' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
