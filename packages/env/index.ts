import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    VERCEL_URL: z
      .string()
      .optional()
      .transform((v) => (v ? `https://${v}` : undefined)),
    PORT: z.coerce.number().default(3000),
  },
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    JWT_SECRET: z.string(),
    CLOUDFLARE_SECRET_KEY: z.string(),
    TMDB_API_KEY: z.string(),
    OPENAI_API_KEY: z.string(),
    KV_URL: z.string(),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLOUDFLARE_SITE_KEY: z.string(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    VERCEL_URL: process.env.VERCEL_URL,
    KV_URL: process.env.KV_URL,
    PORT: process.env.PORT,
    CLOUDFLARE_SECRET_KEY: process.env.CLOUDFLARE_SECRET_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_CLOUDFLARE_SITE_KEY:
      process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY,
  },
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint",
});
