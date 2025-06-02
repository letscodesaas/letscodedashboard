import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_DB!, {
  maxRetriesPerRequest: null,
});

export const QueueInstance = (name: string) => {
  return new Queue(name, {
    connection,
  });
};

export const WorkerInstance = (
  name: string,
  jobs: (job: Job) => Promise<() => void>,
  {}: { concurrency: number }
) => {
  return new Worker(name, jobs, {
    connection,
  });
};
