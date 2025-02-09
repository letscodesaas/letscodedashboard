import { router } from './trpc';
import { jobRouter } from './router/jobs.router';
import { healthRouter } from './router/health.router';

export const appRouter = router({
  job: jobRouter,
  health:healthRouter
});

export type AppRouter = typeof appRouter;
