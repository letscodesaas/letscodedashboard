/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { UserProfile } from '@/models/UserProfile.models';
import InterviewExperience from '@/models/InterviewExperience.Model';
import { Jobs } from '@/models/Job.Model';
import { Subscriber } from '@/models/Subscribers.Model';
import { PublishNewsLetter } from '@/models/PublishNewsLetter.Model';
import { Questions } from '@/models/Question.Model';
import { Product } from '@/models/Product.Model';

DB();

export const GET = async () => {
  try {
    const [
      // Users
      totalUsers,
      publicProfiles,
      completeProfiles,
      userRoles,
      profileViewsAgg,
      totalPointsAgg,

      // Interview Experiences
      totalExperiences,
      pendingExperiences,
      approvedExperiences,
      featuredExperiences,
      selectedExperiences,

      // Jobs
      totalJobs,
      activeJobs,

      // Subscribers & Newsletter
      totalSubscribers,
      totalNewslettersPublished,

      // Content
      totalQuestions,
      totalProducts,
    ] = await Promise.all([
      // Users
      UserProfile.countDocuments(),
      UserProfile.countDocuments({ publicProfile: true }),
      UserProfile.countDocuments({ isProfileComplete: true }),
      UserProfile.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      UserProfile.aggregate([
        { $group: { _id: null, total: { $sum: { $ifNull: ['$views', 0] } } } },
      ]),
      UserProfile.aggregate([
        { $group: { _id: null, total: { $sum: { $ifNull: ['$points', 0] } } } },
      ]),

      // Interview Experiences
      InterviewExperience.countDocuments(),
      InterviewExperience.countDocuments({ isApproved: false }),
      InterviewExperience.countDocuments({ isApproved: true }),
      InterviewExperience.countDocuments({ isFeatured: true }),
      InterviewExperience.countDocuments({ offerStatus: 'Selected' }),

      // Jobs
      Jobs.countDocuments(),
      Jobs.countDocuments({ status: true }),

      // Subscribers & Newsletter
      Subscriber.countDocuments({ subscribed: true }),
      PublishNewsLetter.countDocuments(),

      // Content
      Questions.countDocuments(),
      Product.countDocuments(),
    ]);

    const totalProfileViews = profileViewsAgg[0]?.total ?? 0;
    const totalPoints = totalPointsAgg[0]?.total ?? 0;
    const offerRate =
      totalExperiences > 0
        ? Math.round((selectedExperiences / totalExperiences) * 100)
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          publicProfiles,
          completeProfiles,
          totalProfileViews,
          totalPoints,
          byRole: userRoles.map((r: any) => ({
            role: r._id ?? 'unknown',
            count: r.count,
          })),
        },
        interviewExperiences: {
          total: totalExperiences,
          pending: pendingExperiences,
          approved: approvedExperiences,
          featured: featuredExperiences,
          offerRate,
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          inactive: totalJobs - activeJobs,
        },
        newsletter: {
          subscribers: totalSubscribers,
          published: totalNewslettersPublished,
        },
        content: {
          questions: totalQuestions,
          products: totalProducts,
        },
      },
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch stats',
        error: error.message,
      },
      { status: 500 }
    );
  }
};
