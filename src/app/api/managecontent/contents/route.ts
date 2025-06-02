import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export const GET = async () => {
  try {
    await prisma.$connect();
    const data = await prisma.article.findMany();
    return NextResponse.json({ message: data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
