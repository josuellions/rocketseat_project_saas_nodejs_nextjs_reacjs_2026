import ky from 'ky';
import { getCookie } from 'cookies-next';

import { env } from "@saas_node_next_react/env"

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined;

        // SERVER
        if (typeof window === "undefined") {
          const { cookies } = await import("next/headers");

          token = (await cookies())
            .get(env.NEXT_PUBLIC_COOKIE_TOKEN)
            ?.value;
        }

        // CLIENT
        else {
          token = await getCookie(env.NEXT_PUBLIC_COOKIE_TOKEN);
        }

        if (token) {
          request.headers.set(
            "Authorization",
            `Bearer ${token}`
          );
        }
      },
    ],
  },
});
