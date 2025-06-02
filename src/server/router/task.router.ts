import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import {} from '@/models/Task.model';
import { z } from 'zod';

const tasks = z.object({
  title: z.string(),
  description: z.string(),
  assignTo: z.string(),
  dueDate: z.string(),
  status: z.string(),
});

const task = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  status: z.string(),
});

const userInfo = z.object({
  assignTo: z.string(),
});

const taskAssign = z.object({
  id: z.string(),
  assignTo: z.string(),
});

const adminTask = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  assignTo: z.string(),
  dueDate: z.string(),
  status: z.string(),
});

export const taskRouter = router({
  addTask: publicProcedure.input(tasks).mutation(async (opts) => {
    try {
      const { input } = opts;
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      // create new Task
      await opts.ctx.db.Task.insertMany({
        title: input.title,
        description: input.description,
        assignTo: input.assignTo,
        dueDate: input.dueDate,
        status: input.status,
      });

      return {
        code: 201,
        message: 'CREATED',
      };
    } catch (error) {
      return {
        code: 500,
        message: error,
      };
    }
  }),
  getTask: publicProcedure.input(userInfo).mutation(async (opts) => {
    try {
      const { input } = opts;
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const userTask = await opts.ctx.db.Task.find({
        assignTo: input.assignTo,
      });
      if (!userTask) {
        return {
          code: 404,
          message: 'No Task',
        };
      }

      return {
        code: 200,
        message: userTask,
      };
    } catch (error) {
      return {
        code: 500,
        message: error,
      };
    }
  }),
  getTasks: publicProcedure.query(async (opts) => {
    try {
      const info = await opts.ctx.db.Task.find({});
      if (!info) {
        return {
          code: 500,
          message: 'No Tasks',
        };
      }
      return {
        code: 200,
        message: info,
      };
    } catch (error) {
      return {
        code: 500,
        message: error,
      };
    }
  }),
  updateTasks: publicProcedure.input(task).mutation(async (opts) => {
    try {
      const { input } = opts;
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      // find the task and update
      const res = await opts.ctx.db.Task.findByIdAndUpdate(input.id, {
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        status: input.status,
      });
      console.log(res);

      return {
        code: 200,
        message: 'Updated',
      };
    } catch (error) {
      return {
        code: 500,
        message: error,
      };
    }
  }),
  deleteTasks: publicProcedure.input(taskAssign).mutation(async (opts) => {
    try {
      const { input } = opts;
      const info = await opts.ctx.db.Task.findByIdAndDelete({
        _id: input.id,
      });
      console.log(info);
      return {
        code: 200,
        message: 'Delete',
      };
    } catch (error) {
      return {
        code: 500,
        message: error,
      };
    }
  }),
  updateTasksAdmin: publicProcedure.input(adminTask).mutation(async (opts) => {
    try {
      const { input } = opts;
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      // find the task and update
      await opts.ctx.db.Task.findOneAndUpdate(
        {
          _id: input.id,
        },
        {
          title: input.title,
          description: input.description,
          assignTo: input.assignTo,
          dueDate: input.dueDate,
          status: input.status,
        }
      );

      return {
        code: 200,
        message: 'Updated',
      };
    } catch (error) {
      return {
        code: 500,
        message: error,
      };
    }
  }),
  delteTaskAdmin: publicProcedure.input(task).mutation(async (opts) => {
    try {
      const { input } = opts;
      await opts.ctx.db.Task.findOneAndDelete({
        _id: input.id,
      });

      return {
        code: 200,
        message: 'Delete',
      };
    } catch (error) {
      return {
        code: 500,
        message: error,
      };
    }
  }),
});
