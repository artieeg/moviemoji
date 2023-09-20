import { z } from "zod";
import { kv } from "@vercel/kv";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import levenshtein from "fast-levenshtein";

export const gameRouter = createTRPCRouter({
  submitAnswer: protectedProcedure
    .input(
      z.object({
        movieId: z.string(),
        answer: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { movieId, answer } }) => {
      const movieTitle = await kv.hget<string>(`movie:${movieId}`, "title");

      if (!movieTitle) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const distance = levenshtein.get(
        movieTitle.toLowerCase(),
        answer.toLowerCase(),
      );

      if (
        movieTitle.length > 6 ? distance > movieTitle.length / 3 : distance > 2
      ) {
        return {
          correct: false,
          answer: movieTitle,
        };
      } else {
        return {
          correct: true,
        };
      }
    }),

  getHints: protectedProcedure
    .input(
      z.object({
        movieId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { movieId } }) => {
      const movieTitle = await kv.hget<string>(`movie:${movieId}`, "title");

      if (!movieTitle) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        hint: movieTitle.slice(0, Math.ceil(movieTitle.length / 3)),
      };
    }),

  getItems: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional().default(0),
      }),
    )
    .query(async ({ ctx, input: { cursor } }) => {
      const randomMovieIds = await kv.srandmember<string[]>("movie_ids", 20);

      const pipeline = kv.pipeline();

      if (!randomMovieIds) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      for (const id of randomMovieIds) {
        pipeline.smembers(`movie:${id}:emojis`);
      }

      const emojiSets = await pipeline.exec<string[][]>();

      const challenges: { emojis: string[]; id: string }[] = [];

      for (let i = 0; i < emojiSets.length; i++) {
        const emojiSet = emojiSets[i];

        if (!emojiSet) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        const movieId = randomMovieIds[i];

        if (!movieId) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        if (emojiSet.length !== 5) {
          continue;
        }

        challenges.push({
          emojis: emojiSet,
          id: movieId,
        });
      }

      return {
        challenges,
        nextCursor: cursor + 1,
      };
    }),
});
