import { publicProcedure, router } from '../trpc';

export const contestRouter = router({
  getregisations: publicProcedure.query(async (opts) => {
    try {
      const info = await opts.ctx.db.ContestRegistation.find().sort({
        createdAt: -1,
      });
      return info;
    } catch (error) {
      throw new Error(String(error));
    }
  }),
});
