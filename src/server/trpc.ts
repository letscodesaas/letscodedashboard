import { initTRPC } from '@trpc/server';
import { Jobs } from '@/models/Job.Model';
import { Product } from '@/models/Product.Model';

const t = initTRPC.context<{ db: { Jobs: typeof Jobs,Product: typeof Product } }>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
