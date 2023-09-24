import { z } from "zod";
import { kv } from "@vercel/kv";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import levenshtein from "fast-levenshtein";

export type Challenge = {
  emojis: string[];
  id: string;
  expectedLength: number;
  expectedWordCount: number;
};

export const gameRouter = createTRPCRouter({
  submitAnswer: protectedProcedure
    .input(
      z.object({
        movieId: z.string(),
        answer: z.string(),
      }),
    )
    .mutation(async ({ input: { movieId, answer } }) => {
      const movieTitle = await kv.hget<string>(`movie:${movieId}`, "title");

      if (!movieTitle) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const distance = levenshtein.get(
        movieTitle.toLowerCase().trim(),
        answer.toLowerCase().trim(),
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
    .query(async ({ input: { movieId } }) => {
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
    .query(async ({ input: { cursor } }) => {
      const randomMovieIds = await kv.srandmember<string[]>("movie_ids", 20);

      const getMovieTitlePipeline = kv.pipeline();
      const getEmojisPipeline = kv.pipeline();

      if (!randomMovieIds) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      for (const id of randomMovieIds) {
        getEmojisPipeline.smembers(`movie:${id}:emojis`);
        getMovieTitlePipeline.hget(`movie:${id}`, "title");
      }

      const [emojiSets, titles] = await Promise.all([
        getEmojisPipeline.exec<string[][]>(),
        getMovieTitlePipeline.exec<string[]>(),
      ]);

      const challenges: Challenge[] = [];

      for (let i = 0; i < emojiSets.length; i++) {
        const emojiSet = emojiSets[i];
        const title = titles[i];

        if (!emojiSet || !title) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        const expectedLength = title.length;
        const expectedWordCount = title.split(" ").length;

        const movieId = randomMovieIds[i];

        if (!movieId) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        challenges.push({
          emojis: emojiSet,
          expectedLength,
          expectedWordCount,
          id: movieId,
        });
      }

      return {
        challenges,
        nextCursor: cursor + 1,
      };
    }),
});
