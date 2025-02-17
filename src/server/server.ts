import { router } from './trpc';
import { jobRouter } from './router/jobs.router';
import { healthRouter } from './router/health.router';
import { productRouter } from './router/product.router';

export const appRouter = router({
  job: jobRouter,
  health: healthRouter,
  product:productRouter
});

export type AppRouter = typeof appRouter;
