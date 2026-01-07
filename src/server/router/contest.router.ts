import { publicProcedure, router } from '../trpc';

export const contestRouter = router({
  getregisations: publicProcedure.query(async (opts) => {
    try {
      const info = await opts.ctx.db.ContestRegistation.find({});
      return info;
    } catch (error) {
      throw new Error(String(error));
    }
  }),
});
