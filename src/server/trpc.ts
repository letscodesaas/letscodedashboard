import { initTRPC } from '@trpc/server';
import { Jobs } from '@/models/Job.Model';

const t = initTRPC.context<{ db: { Jobs: typeof Jobs } }>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
