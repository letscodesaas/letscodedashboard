import { router } from './trpc';
import { jobRouter } from './router/jobs.router';
import { healthRouter } from './router/health.router';
import { productRouter } from './router/product.router';
import { authRouter } from './router/auth.router';
import {taskRouter} from "./router/task.router"

export const appRouter = router({
  job: jobRouter,
  health: healthRouter,
  product: productRouter,
  auth: authRouter,
  task:taskRouter
});

export type AppRouter = typeof appRouter;
