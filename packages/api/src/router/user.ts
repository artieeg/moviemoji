import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure.input(z.object({})).mutation(async () => {}),
});
