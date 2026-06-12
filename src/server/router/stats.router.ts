import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const statsRouter = router({
  getToolUsageStats: publicProcedure
    .input(
      z.object({
        days: z.number().default(30),
      })
    )
    .query(async (opts) => {
      const { input } = opts;
      const db = opts.ctx.db;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const baseMatch = {
        createdAt: { $gte: startDate },
        tool: { $nin: ['resume_builder', 'job_tracker'] },
      };

      // Total tool usage by type
      const toolUsageByType = await db.ToolUsage.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: '$tool',
            count: { $sum: 1 },
            successCount: { $sum: { $cond: ['$success', 1, 0] } },
            avgResponseTime: { $avg: '$responseTimeMs' },
          },
        },
        { $sort: { count: -1 } },
      ]);

      // Success rate by tool
      const successRateByTool = await db.ToolUsage.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: '$tool',
            total: { $sum: 1 },
            success: { $sum: { $cond: ['$success', 1, 0] } },
          },
        },
        {
          $project: {
            tool: '$_id',
            _id: 0,
            total: 1,
            success: 1,
            successRate: {
              $round: [
                { $multiply: [{ $divide: ['$success', '$total'] }, 100] },
                2,
              ],
            },
          },
        },
        { $sort: { total: -1 } },
      ]);

      // Usage trends over time
      const usageTrends = await db.ToolUsage.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
            successCount: { $sum: { $cond: ['$success', 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Action breakdown
      const actionBreakdown = await db.ToolUsage.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 },
            successCount: { $sum: { $cond: ['$success', 1, 0] } },
          },
        },
        { $sort: { count: -1 } },
      ]);

      // Overall stats
      const overallStats = await db.ToolUsage.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: null,
            totalUsage: { $sum: 1 },
            successCount: { $sum: { $cond: ['$success', 1, 0] } },
            failureCount: { $sum: { $cond: ['$success', 0, 1] } },
            avgResponseTime: { $avg: '$responseTimeMs' },
            maxResponseTime: { $max: '$responseTimeMs' },
            minResponseTime: { $min: '$responseTimeMs' },
            uniqueUsers: { $addToSet: '$userId' },
          },
        },
        {
          $project: {
            _id: 0,
            totalUsage: 1,
            successCount: 1,
            failureCount: 1,
            successRate: {
              $round: [
                {
                  $multiply: [
                    { $divide: ['$successCount', '$totalUsage'] },
                    100,
                  ],
                },
                2,
              ],
            },
            avgResponseTime: { $round: ['$avgResponseTime', 2] },
            maxResponseTime: 1,
            minResponseTime: 1,
            uniqueUsers: { $size: '$uniqueUsers' },
          },
        },
      ]);

      return {
        toolUsageByType,
        successRateByTool,
        usageTrends,
        actionBreakdown,
        overallStats: overallStats[0] || {
          totalUsage: 0,
          successCount: 0,
          failureCount: 0,
          successRate: 0,
          avgResponseTime: 0,
          maxResponseTime: 0,
          minResponseTime: 0,
          uniqueUsers: 0,
        },
      };
    }),

  getToolDetailStats: publicProcedure
    .input(
      z.object({
        tool: z.string(),
        days: z.number().default(30),
      })
    )
    .query(async (opts) => {
      const { input } = opts;
      const db = opts.ctx.db;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const detailStats = await db.ToolUsage.aggregate([
        {
          $match: {
            tool: input.tool,
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 },
            successCount: { $sum: { $cond: ['$success', 1, 0] } },
            avgResponseTime: { $avg: '$responseTimeMs' },
          },
        },
        { $sort: { count: -1 } },
      ]);

      return detailStats;
    }),

  getResumeBuilderStats: publicProcedure
    .input(z.object({ days: z.number().default(30) }))
    .query(async (opts) => {
      const { input } = opts;
      const db = opts.ctx.db;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const match = { tool: 'resume_builder', createdAt: { $gte: startDate } };

      const [actionCounts, dailyTrend, userBreakdown, uniqueUsersResult] =
        await Promise.all([
          db.ToolUsage.aggregate([
            { $match: match },
            { $group: { _id: '$action', count: { $sum: 1 } } },
          ]),
          db.ToolUsage.aggregate([
            { $match: match },
            {
              $group: {
                _id: {
                  date: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                  },
                  action: '$action',
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { '_id.date': 1 } },
          ]),
          db.ToolUsage.aggregate([
            { $match: match },
            {
              $group: {
                _id: {
                  $cond: [
                    { $eq: ['$userId', 'guest'] },
                    'guest',
                    'authenticated',
                  ],
                },
                count: { $sum: 1 },
              },
            },
          ]),
          db.ToolUsage.aggregate([
            { $match: match },
            { $group: { _id: '$userId' } },
            { $count: 'total' },
          ]),
        ]);

      const actions: Record<string, number> = {};
      actionCounts.forEach((a: { _id: string; count: number }) => {
        actions[a._id] = a.count;
      });

      const opens = actions['open'] || 0;
      const downloads = actions['download'] || 0;
      const saves = actions['save'] || 0;
      const updates = actions['update'] || 0;

      return {
        summary: {
          opens,
          downloads,
          saves,
          updates,
          total: opens + downloads + saves + updates,
          downloadRate:
            opens > 0 ? Math.round((downloads / opens) * 100 * 100) / 100 : 0,
          saveRate:
            opens > 0 ? Math.round((saves / opens) * 100 * 100) / 100 : 0,
          uniqueUsers:
            (uniqueUsersResult[0] as { total: number } | undefined)?.total || 0,
        },
        dailyTrend,
        userBreakdown,
      };
    }),

  getJobTrackerStats: publicProcedure
    .input(z.object({ days: z.number().default(1) }))
    .query(async (opts) => {
      const { input } = opts;
      const db = opts.ctx.db;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const match = { tool: 'job_tracker', createdAt: { $gte: startDate } };

      const [
        actionCounts,
        statusDistribution,
        statusTransitions,
        topCompanies,
        appliedFromSources,
        dailyTrend,
        topUsers,
      ] = await Promise.all([
        // Action counts
        db.ToolUsage.aggregate([
          { $match: match },
          { $group: { _id: '$action', count: { $sum: 1 } } },
        ]),

        // Status distribution from job_added metadata
        db.ToolUsage.aggregate([
          { $match: { ...match, action: 'job_added' } },
          { $group: { _id: '$metadata.status', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),

        // Status transitions (status_changed)
        db.ToolUsage.aggregate([
          { $match: { ...match, action: 'status_changed' } },
          {
            $group: {
              _id: {
                from: '$metadata.oldStatus',
                to: '$metadata.newStatus',
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),

        // Top companies applied to
        db.ToolUsage.aggregate([
          { $match: { ...match, action: 'job_added' } },
          { $group: { _id: '$metadata.companyName', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),

        // Applied from sources
        db.ToolUsage.aggregate([
          { $match: { ...match, action: 'job_added' } },
          { $group: { _id: '$metadata.appliedFrom', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),

        // Daily trend by action
        db.ToolUsage.aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                date: {
                  $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                action: '$action',
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.date': 1 } },
        ]),

        // Top active users (from metadata.userEmail)
        db.ToolUsage.aggregate([
          { $match: { ...match, action: 'job_added' } },
          {
            $group: {
              _id: '$metadata.userEmail',
              name: { $first: '$metadata.userName' },
              jobsAdded: { $sum: 1 },
            },
          },
          { $sort: { jobsAdded: -1 } },
          { $limit: 10 },
        ]),
      ]);

      const actions: Record<string, number> = {};
      actionCounts.forEach((a: { _id: string; count: number }) => {
        actions[a._id] = a.count;
      });

      const uniqueUsersResult = await db.ToolUsage.aggregate([
        { $match: match },
        { $group: { _id: '$metadata.userEmail' } },
        { $count: 'total' },
      ]);

      return {
        summary: {
          jobsAdded: actions['job_added'] || 0,
          statusChanges: actions['status_changed'] || 0,
          jobsEdited: actions['job_edited'] || 0,
          jobsDeleted: actions['job_deleted'] || 0,
          totalEvents:
            (actions['job_added'] || 0) +
            (actions['status_changed'] || 0) +
            (actions['job_edited'] || 0) +
            (actions['job_deleted'] || 0),
          uniqueUsers:
            (uniqueUsersResult[0] as { total: number } | undefined)?.total || 0,
        },
        statusDistribution,
        statusTransitions,
        topCompanies,
        appliedFromSources,
        dailyTrend,
        topUsers,
      };
    }),

  getUserJobPipeline: publicProcedure
    .input(z.object({ days: z.number().default(30) }))
    .query(async (opts) => {
      const { input } = opts;
      const db = opts.ctx.db;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      // Get all jobs added per user, then reconstruct latest status
      // by applying status_changed events on top
      const jobsAdded = await db.ToolUsage.aggregate([
        {
          $match: {
            tool: 'job_tracker',
            action: 'job_added',
            createdAt: { $gte: startDate },
          },
        },
        { $sort: { createdAt: 1 } },
        {
          $group: {
            _id: '$metadata.userEmail',
            userName: { $first: '$metadata.userName' },
            jobs: {
              $push: {
                jobId: '$metadata.jobId',
                company: '$metadata.companyName',
                role: '$metadata.role',
                status: '$metadata.status',
                appliedFrom: '$metadata.appliedFrom',
                addedAt: '$createdAt',
              },
            },
          },
        },
        { $addFields: { totalJobs: { $size: '$jobs' } } },
        { $sort: { totalJobs: -1 } },
        { $limit: 100 },
      ]);

      // Fetch status_changed events to update job statuses
      const statusChanges = await db.ToolUsage.aggregate([
        {
          $match: {
            tool: 'job_tracker',
            action: 'status_changed',
            createdAt: { $gte: startDate },
          },
        },
        { $sort: { createdAt: 1 } },
        {
          $group: {
            _id: {
              userEmail: '$metadata.userEmail',
              jobId: '$metadata.jobId',
            },
            latestStatus: { $last: '$metadata.newStatus' },
          },
        },
      ]);

      // Build a lookup map for latest status by (userEmail, jobId)
      const statusMap = new Map<string, string>();
      statusChanges.forEach(
        (s: { _id: { userEmail: string; jobId: string }; latestStatus: string }) => {
          if (s._id.jobId) {
            statusMap.set(`${s._id.userEmail}::${s._id.jobId}`, s.latestStatus);
          }
        }
      );

      // Merge latest status into each user's jobs
      const pipeline = jobsAdded.map(
        (user: {
          _id: string;
          userName: string;
          totalJobs: number;
          jobs: Array<{
            jobId?: string;
            company: string;
            role?: string;
            status: string;
            appliedFrom: string;
            addedAt: string;
          }>;
        }) => ({
          email: user._id,
          userName: user.userName,
          totalJobs: user.totalJobs,
          jobs: user.jobs.map((job) => ({
            ...job,
            status:
              (job.jobId && statusMap.get(`${user._id}::${job.jobId}`)) ||
              job.status ||
              'Applied',
          })),
        })
      );

      return pipeline;
    }),
});
