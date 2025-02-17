import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

const productInfo = z.object({
  title: z.string(),
  description: z.string(),
  productLink: z.string(),
  imageLink: z.string(),
  price: z.number(),
});

const updateProductInfo = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  productLink: z.string(),
  imageLink: z.string(),
  price: z.number(),
});

export const productRouter = router({
  createProduct: publicProcedure.input(productInfo).mutation(async (opts) => {
    const { input } = await opts;
    if (!input) {
      return new TRPCError({ code: 'BAD_REQUEST' });
    }
    await opts.ctx.db.Product.insertMany(input);
    return {
      statusCode: 201,
      message: 'CREATED',
    };
  }),
  getAllProduct: publicProcedure.query(async (opts) => {
    const data = await opts.ctx.db.Product.find({})
      .sort({ createdAt: -1 })
    if (!data) {
      return new TRPCError({ code: 'NOT_FOUND' });
    }
    return {
      statusCode: 200,
      message: data,
    };
  }),
  getProduct: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async (opts) => {
      const data = await opts.ctx.db.Product.findById(opts.input.id);
      if (!data) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }
      return {
        statusCode: 200,
        message: data,
      };
    }),
  updateProduct: publicProcedure
    .input(updateProductInfo)
    .mutation(async (opts) => {
      const { input } = await opts;
      if (!input) {
        return new TRPCError({ code: 'BAD_REQUEST' });
      }
      await opts.ctx.db.Product.findByIdAndUpdate(input.id, {
        title: input.title,
        description: input.description,
        productLink: input.productLink,
        imageLink: input.imageLink,
        price: input.price,
      });

      return {
        statusCode: 200,
        message: 'UPDATED',
      };
    }),

  deleteProduct: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async (opts) => {
      await opts.ctx.db.Product.findByIdAndDelete(opts.input.id);
      return {
        statusCode: 200,
        message: 'DELETED',
      };
    }),
});
