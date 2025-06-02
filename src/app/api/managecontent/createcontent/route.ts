import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/utils/prisma';

export const POST = async (request: NextRequest) => {
  try {
    await prisma.$connect();
    const data = await request.json();
    if (
      !data ||
      !data.name ||
      !data.content ||
      !data.category ||
      !data.isPublised
    ) {
      return NextResponse.json({ message: 'EMPTY REQUEST' }, { status: 404 });
    }
    await prisma.article.create({
      data: {
        name: data?.name as string,
        content: data?.content as string,
        category: data?.category as string,
        isPublised: data?.isPublised as boolean,
      },
    });
    return NextResponse.json({ message: 'CREATED' }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
