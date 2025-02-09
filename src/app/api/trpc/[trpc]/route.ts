import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/server';
import { Jobs } from '@/models/Job.Model';
import mongoose from 'mongoose';


mongoose.connect(process.env.DB!);
const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => {
      return {
        db: {
          Jobs,
        },
      };
    },
  });
};

export { handler as GET, handler as POST };
