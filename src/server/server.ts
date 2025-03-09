import { router } from './trpc';
import { jobRouter } from './router/jobs.router';
import { healthRouter } from './router/health.router';
import { productRouter } from './router/product.router';
import { authRouter } from './router/auth.route';

export const appRouter = router({
  job: jobRouter,
  health: healthRouter,
  product: productRouter,
  auth:authRouter
});

export type AppRouter = typeof appRouter;
