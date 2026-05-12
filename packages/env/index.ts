import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    JWT_SECRET: z.string(),
    GTIHUB_OAUTH_CLIENT_ID: z.string(),
    GTIHUB_OAUTH_CLIENT_SECRET: z.string(),
    GTIHUB_OAUTH_CLIENT_REDIRECT_URI: z.url(),
    SERVER_PORT: z.coerce.number().default(3333),
  },
  client: {},
  shared: {},
  runtimeEnv: {
    SERVER_PORT: process.env.SERVER_PORT,
    JWT_SECRET:  process.env.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    GTIHUB_OAUTH_CLIENT_ID: process.env.GTIHUB_OAUTH_CLIENT_ID,
    GTIHUB_OAUTH_CLIENT_SECRET: process.env.GTIHUB_OAUTH_CLIENT_SECRET,
    GTIHUB_OAUTH_CLIENT_REDIRECT_URI: process.env.GTIHUB_OAUTH_CLIENT_REDIRECT_URI,
  },
  emptyStringAsUndefined: true,
})
