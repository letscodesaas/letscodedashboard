import InterviewExperience from '@/models/InterviewExperience.Model';
import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { isAllowed } from '@/lib/isAllowed';
import { sendEmail } from '@/utils/sendEmail';
import { InterviewExperienceFeaturedEmailTemplate } from '@/template/interview';
DB();
export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }
  const body = await req.json();
  const token = body.token;
  try {
    await isAllowed(token, 'admin');
    const experience = await InterviewExperience.findById(id);
    if (!experience) {
      return NextResponse.json(
        { message: 'Experience not found' },
        { status: 404 }
      );
    }
    const isFeatured = experience.isFeatured;
    // if the experience is already featured, unfeature it, otherwise feature it if total count of featured experiences is less than 4
    if (!isFeatured) {
      const featuredCount = await InterviewExperience.countDocuments({
        isFeatured: true,
      });
      if (featuredCount >= 4) {
        return NextResponse.json(
          { message: 'Cannot feature more than 4 experiences' },
          { status: 400 }
        );
      }
    }
    const updated = await InterviewExperience.findByIdAndUpdate(
      id,
      { isFeatured: !isFeatured },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json(
        { message: 'Failed to toggle feature status' },
        { status: 500 }
      );
    }
    // if the experience is featured, send an email to the user
    if (!isFeatured) {
      await sendEmail({
        destinationMail: updated.userEmail,
        subject: "Congratulations! Your Interview Experience is Featured on Let's Code",
        htmlBody: InterviewExperienceFeaturedEmailTemplate(updated.name)
      });
    }
    return NextResponse.json(
      {
        success: true,
        message: `Experience ${isFeatured ? 'unfeatured' : 'featured'} successfully`,
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to toggle feature status', error },
      { status: 500 }
    );
  }
};
