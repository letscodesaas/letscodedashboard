import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/server';
import { Jobs } from '@/models/Job.Model';
import { Product } from '@/models/Product.Model';
import { Auth } from '@/models/Auth.Model';
import { Task } from '@/models/Task.model';
import { Questions } from '@/models/Question.Model';
import { ContestRegister } from '@/models/Contest.Model';
import { ToolUsage } from '@/models/ToolUsage.Model';
import mongoose from 'mongoose';

let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  await mongoose.connect(process.env.DB!);
  isConnected = true;
}

const handler = async (req: Request) => {
  await connectDB();
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => {
      return {
        db: {
          Jobs,
          Product,
          Auth,
          Task,
          Questions,
          ContestRegistation: ContestRegister,
          ToolUsage,
        },
      };
    },
  });
};

export { handler as GET, handler as POST };
