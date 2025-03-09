import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(
  'rediss://default:ATmxAAIjcDE1MWUwY2Q3YTdhYzA0ZTBmODUzY2QyNGUwMTU3NTI3YnAxMA@touched-corgi-14769.upstash.io:6379',
  { maxRetriesPerRequest: null }
);

export const QueueInstance = (name: string) => {
  return new Queue(name, {
    connection,
  });
};

export const WorkerInstance = (
  name: string,
  jobs: (job: Job) => Promise<() => void>
) => {
  return new Worker(name, jobs, {
    connection,
  });
};
