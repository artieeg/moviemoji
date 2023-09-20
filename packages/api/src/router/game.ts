import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const gameRouter = createTRPCRouter({
  getItems: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional().default(0),
      }),
    )
    .query(async ({ ctx, input: { cursor } }) => {
      return {
        emojis: [
          ["👋", "👋", "👋", "👋"],
          ["🤔", "🤔", "🤔", "🤔"],
          ["👋", "👋", "👋", "👋"],
          ["🤔", "🤔", "🤔", "🤔"],
          ["👋", "👋", "👋", "👋"],
          ["🤔", "🤔", "🤔", "🤔"],
          ["👋", "👋", "👋", "👋"],
          ["🤔", "🤔", "🤔", "🤔"],
          ["👋", "👋", "👋", "👋"],
          ["🤔", "🤔", "🤔", "🤔"],
          ["👋", "👋", "👋", "👋"],
          ["🤔", "🤔", "🤔", "🤔"],
        ],
        nextCursor: cursor + 1,
      };
    }),
});
