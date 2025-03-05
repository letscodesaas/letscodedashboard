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
  applyLink: z.string(),
  status: z.boolean(),
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
  applyLink: z.string(),
  status: z.boolean(),
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
        applyLink: input.applyLink,
        status: input.status,
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

  deactivateJob: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        const { input } = opts;
        await opts.ctx.db.Jobs.findByIdAndUpdate(input.id, {
          status: false,
        });
        return {
          status: 200,
          message: 'Done',
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  getAllJobs: publicProcedure.query(async (opts) => {
    const data = await opts.ctx.db.Jobs.find({
      status: true,
    }).sort({ createdAt: -1 });
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
    .mutation(async (opts) => {
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
