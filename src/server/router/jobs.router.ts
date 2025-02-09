import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

const jobInfo = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  type: z.string(),
  experience: z.string(),
  salary: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
  applyLink: z.string(),
});

const updateJobInfo = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  type: z.string(),
  experience: z.string(),
  salary: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
  applyLink: z.string(),
});

export const jobRouter = router({
  createJobPost: publicProcedure.input(jobInfo).mutation(async (opts) => {
    const { input } = await opts;
    if (!input) {
      return new TRPCError({ code: 'NOT_FOUND' });
    }
    await opts.ctx.db.Jobs.insertMany(opts.input);
    return {
      message: 'created',
    };
  }),
  updateJobPost: publicProcedure.input(updateJobInfo).mutation(async (opts) => {
    const { input } = await opts;
    if (!input) {
      return new TRPCError({ code: 'NOT_FOUND' });
    }
    await opts.ctx.db.Jobs.findByIdAndUpdate(
      { _id: input.id },
      {
        title: input.title,
        company: input.company,
        location: input.location,
        type: input.type,
        experience: input.experience,
        salary: input.salary,
        description: input.description,
        requirements: input.requirements,
        applyLink: input.applyLink,
      }
    );

    return {
      message: 'updated',
    };
  }),
  deleteJobPost: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = await opts;
      if (!input) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }
      await opts.ctx.db.Jobs.findByIdAndDelete({ _id: input.id });
      return {
        status: 200,
        message: 'Deleted',
      };
    }),

  getAllJobs: publicProcedure.query(async (opts) => {
    const data = await opts.ctx.db.Jobs.find({});
    return {
      data,
    };
  }),
  getJob: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async (opts) => {
      const { input } = await opts;
      if (!input) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }
      const data = await opts.ctx.db.Jobs.findById(input.id);
      return {
        message: data,
      };
    }),
});
