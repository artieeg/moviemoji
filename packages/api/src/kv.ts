import { env } from "@moviemoji/env";
import { Redis } from "ioredis";

export const kv = new Redis(env.REDIS_URL);
