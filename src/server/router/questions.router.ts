import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';

const questionType = z.object({
  title: z.string(),
  content: z.string(),
  categories:z.string(),
  contentType: z.string(),
  exceptedInput: z.string(),
  exceptedOutput: z.string(),
  testInput: z.string(),
  testOutput: z.string(),
});

const questionTypeID = z.object({
  id: z.string(),
});

const questionTypeWithID = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  categories: z.string(),
  contentType: z.string(),
  exceptedInput: z.string(),
  exceptedOutput: z.string(),
  testInput: z.string(),
  testOutput: z.string(),
});

export const questionRouter = router({
  addquestions: publicProcedure.input(questionType).mutation(async (opts) => {
    try {
      const { input } = opts;
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      // create new question
      await opts.ctx.db.Questions.create({
        title: input.title,
        content: input.content,
        categories: input.categories,
        contentType: input.contentType,
        exceptedInput: input.exceptedInput,
        exceptedOutput: input.exceptedOutput,
        testInput: input.testInput,
        testOutput: input.testOutput,
      });

      return {
        statusCode: 201,
        message: 'Success',
      };
    } catch (error) {
      console.log(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
  getquestions: publicProcedure.query(async (opts) => {
    try {
      const info = await opts.ctx.db.Questions.find({});
      return {
        code: 200,
        data: info,
        message: 'success',
      };
    } catch (error) {
      console.log(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
  getquestion: publicProcedure.input(questionTypeID).mutation(async (opts) => {
    try {
      const { input } = opts;
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
      const info = await opts.ctx.db.Questions.findById(input.id);
      if (!info) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      return {
        code: 200,
        message: 'success',
        data: info,
      };
    } catch (error) {
      console.log(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
  updatequestion: publicProcedure
    .input(questionTypeWithID)
    .mutation(async (opts) => {
      try {
        const { input } = opts;
        if (!input) {
          throw new TRPCError({ code: 'BAD_REQUEST' });
        }
        await opts.ctx.db.Questions.findByIdAndUpdate(input.id, {
          title: input.title,
          content: input.content,
          categories: input.categories,
          contentType: input.contentType,
          exceptedInput: input.exceptedInput,
          exceptedOutput: input.exceptedOutput,
          testInput: input.testInput,
          testOutput: input.testOutput,
        });
        return {
          code: 200,
          message: 'success',
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),

  deletequestion: publicProcedure
    .input(questionTypeID)
    .mutation(async (opts) => {
      try {
        const { input } = opts;
        if (!input) {
          throw new TRPCError({ code: 'BAD_REQUEST' });
        }
        const info = await opts.ctx.db.Questions.findById(input.id);
        if (!info) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        await opts.ctx.db.Questions.findByIdAndDelete(input.id);
        return {
          code: 200,
          message: 'success',
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
});
