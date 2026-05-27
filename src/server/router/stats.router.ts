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

      // Total tool usage by type
      const toolUsageByType = await db.ToolUsage.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
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
        { $match: { createdAt: { $gte: startDate } } },
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
              $round: [{ $multiply: [{ $divide: ['$success', '$total'] }, 100] }, 2],
            },
          },
        },
        { $sort: { total: -1 } },
      ]);

      // Usage trends over time
      const usageTrends = await db.ToolUsage.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
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
        { $match: { createdAt: { $gte: startDate } } },
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
        { $match: { createdAt: { $gte: startDate } } },
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
              $round: [{ $multiply: [{ $divide: ['$successCount', '$totalUsage'] }, 100] }, 2],
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
});
