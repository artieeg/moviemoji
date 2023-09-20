import { env } from "@moviemoji/env";
import axios from "axios";
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

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    Authorization: `Bearer ${env.TMDB_API_KEY}`,
  },
});

const movie = z
  .object({
    id: z.number(),
    title: z.string(),
    overview: z.string(),
    poster_path: z.string(),
  })
  .passthrough();

const movieList = z.array(movie);

import { kv } from "@vercel/kv";
import OpenAI from "openai";

