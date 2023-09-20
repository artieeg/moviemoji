import { env } from "@moviemoji/env";
import { kv } from "@vercel/kv";
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
  const latestTmdbPage = (await kv.get<number>("latestTmdbPage")) ?? 1;

  if (latestTmdbPage >= 20) {
    return;
  }

  const movies = await getMovies(latestTmdbPage + 1);

  const pipeline = kv.pipeline();

  for (const m of movies) {
    const emojis = await getEmojis(m.title, m.overview);

    if (!emojis) {
      continue;
    }

    pipeline
      .hmset(`movie:${m.id}`, m)
      .sadd("movie_ids", m.id)
      .sadd(`movie:${m.id}:emojis`, ...emojis);
  }

  pipeline
    .set<number>("latestTmdbPage", latestTmdbPage + 1);

  await pipeline.exec();
}

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

async function getEmojis(title: string, overview: string) {
  const prompt = `Produce a list of FOUR emojis representing this movie
title: """${title}"""

overview: """${overview}"""

REPLY WITH A JSON ARRAY CONTAINING 4 EMOJIS REPRESENTING THE MOVIE:`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ content: prompt, role: "user" }],
  });

  const msg = completion.choices[0]?.message?.content;

  if (!msg) {
    return undefined;
  }

  const emojis = JSON.parse(msg);

  return emojis;
}

async function getMovies(page: number) {
  const request = await fetch(
    "https://api.themoviedb.org/3/discover/movie?" +
      new URLSearchParams({
        order_by: "vote_average.desc",
        min_vote_count: "300",
        "primary_release_date.lte": "2020",
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
