import { initTRPC } from '@trpc/server';
import { Jobs } from '@/models/Job.Model';
import { Product } from '@/models/Product.Model';
import { Auth } from '@/models/Auth.Model';
import { Task } from '@/models/Task.model';
import { Questions } from '@/models/Question.Model';
import { ContestRegister } from '@/models/Contest.Model';

const t = initTRPC
  .context<{
    db: {
      Jobs: typeof Jobs;
      Product: typeof Product;
      Auth: typeof Auth;
      Task: typeof Task;
      Questions: typeof Questions;
      ContestRegistation:typeof ContestRegister
    };
  }>()
  .create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
