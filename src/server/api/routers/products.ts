import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.products.findMany();
  }),
  getOne: publicProcedure.input(Number).query(({ ctx, input }) => {
    return ctx.db.products.findUnique({ where: { id: input } });
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.products.create({
        data: {
          name: input.name,
          price: input.price,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string() || null,
        price: z.number() || null,
        on_stock: z.number() || null,
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.products.update({
        where: { id: input.id },
        data: {
          name: input.name,
          price: input.price,
          on_stock: input.on_stock,
        },
      });
    }),
});
