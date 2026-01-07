import { router } from './trpc';
import { jobRouter } from './router/jobs.router';
import { healthRouter } from './router/health.router';
import { productRouter } from './router/product.router';
import { authRouter } from './router/auth.router';
import { taskRouter } from './router/task.router';
import { questionRouter } from './router/questions.router';
import { contestRouter } from './router/contest.router';

export const appRouter = router({
  job: jobRouter,
  health: healthRouter,
  product: productRouter,
  auth: authRouter,
  task: taskRouter,
  question: questionRouter,
  contest: contestRouter,
});

export type AppRouter = typeof appRouter;
