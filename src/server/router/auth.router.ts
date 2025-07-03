import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const policySchema = z.object({
  title: z.string(),
  access: z.boolean(),
  resources: z.array(z.string()),
  link: z.array(z.string()),
});

// Main user schema
const userType = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.string(),
  verified: z.boolean(),
  policy: z.array(policySchema),
});

const userLoginType = z.object({
  email: z.string(),
  password: z.string(),
});

const userVerifyType = z.object({
  id: z.string(),
});

export const authRouter = router({
  signup: publicProcedure.input(userType).mutation(async (opts) => {
    try {
      const { input } = opts;
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
      const findUser = await opts.ctx.db.Auth.findOne({
        emails: input.email,
      });
      if (findUser) {
        throw new TRPCError({ code: 'CONFLICT' });
      }
      const hashedPassword = await bcryptjs.hash(input.password, 10);
      await opts.ctx.db.Auth.insertMany({
        email: input.email,
        password: hashedPassword,
        role: input.role,
        policy: input.policy,
      });
      return {
        statusCode: 201,
        message: 'created',
      };
    } catch (error) {
      console.log(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
  signin: publicProcedure.input(userLoginType).mutation(async (opts) => {
    try {
      const { input } = opts;
      if (!input) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
      const findUser = await opts.ctx.db.Auth.findOne({
        email: input.email,
      });
      if (!findUser || findUser.verified == false) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const checkPassword = await bcryptjs.compare(
        input.password,
        findUser.password
      );
      if (!checkPassword) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const userInfo = {
        id: findUser._id,
        role: findUser.role,
        email: findUser.email,
        policy: findUser.policy,
      };
      const authToken = await jwt.sign(userInfo, 'secret');
      return {
        status: 200,
        message: authToken,
      };
    } catch (error) {
      console.log(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
  verify: publicProcedure.input(userVerifyType).mutation(async (opts) => {
    try {
      const { input } = opts;
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
      await opts.ctx.db.Auth.findByIdAndUpdate(input.id, {
        verified: true,
      });
      return {
        status: 200,
        message: 'verified',
      };
    } catch (error) {
      console.log(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
  users: publicProcedure.query(async (opts) => {
    try {
      const data = await opts.ctx.db.Auth.find({});
      if (!data) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      return {
        status: 200,
        message: data,
      };
    } catch (error) {
      console.log(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
