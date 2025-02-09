import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

const productInfo = z.object({
  title: z.string(),
});

export const productRouter = router({
  createProduct: publicProcedure.input(productInfo).mutation(async (opts) => {
    const { input } = await opts;
    return {
      input,
    };
  }),
});
