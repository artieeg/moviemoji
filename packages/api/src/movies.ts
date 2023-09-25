import { env } from "@moviemoji/env";
import { createId } from "@paralleldrive/cuid2";
import { kv } from "./kv";
import OpenAI from "openai";
import { z } from "zod";

export const movieSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    overview: z.string(),
    poster_path: z.string(),
  })
  .passthrough();

const movieList = z.array(movieSchema);

export async function populateMovies() {
  for (let i = 0; i < 20; i++) {
    const latestTmdbPage = Number(await kv.get("latestTmdbPage")) ?? 1;

    if (latestTmdbPage >= 20) {
      return;
    }

    const movies = await getMovies(latestTmdbPage + 1);

    const pipeline = kv.pipeline();

    for (const m of movies) {
      try {
        // Skip movies with long title cause they're not fun
        if (m.title.length > 18) {
          continue;
        }

        const emojis = await getEmojis(m.title, m.overview);

        if (!emojis || emojis.length !== 5) {
          continue;
        }

        const id = createId();

        pipeline
          .hmset(`movie:${id}`, m)
          .sadd("movie_ids", id)
          .set(`length:${id}`, emojis.length)
          .sadd(`movie:${id}:emojis`, ...emojis);
      } catch (e) {
        continue;
      }
    }

    pipeline.set("latestTmdbPage", latestTmdbPage + 1);

    await pipeline.exec();
  }
}

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

async function getEmojis(title: string, overview: string) {
  const prompt = `Produce a list of FIVE emojis representing this movie
title: """${title}"""

overview: """${overview}"""

EMOJIS SHOULD BE SEPARATED BY WHITESPACE.

REPLY WITH A STRING CONTAINING 5 EMOJIS REPRESENTING THE MOVIE:`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ content: prompt, role: "user" }],
  });

  const msg = completion.choices[0]?.message?.content;

  if (!msg) {
    return undefined;
  }

  console.log(msg);

  const emojis = msg.split(" ");

  console.log(emojis);

  return emojis;
}

async function getMovies(page: number) {
  const request = await fetch(
    "https://api.themoviedb.org/3/discover/movie?" +
      new URLSearchParams({
        include_adult: "false",
        order_by: "vote_average.desc",
        min_vote_count: "500",
        "vote_average.gte": "7",
        "primary_release_date.lte": "2016-01-01",
        page: page.toString(),
      }),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.TMDB_API_KEY}`,
      },
    },
  );

  const movies = await request.json();

  const m = movieList.parse(movies.results);

  return m;
}
