import { gameRouter } from "./router/game";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({ userRouter, gameRouter });

// export type definition of API
export type AppRouter = typeof appRouter;
