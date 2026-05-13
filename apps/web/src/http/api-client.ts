import ky from 'ky';
import { getCookie } from 'cookies-next';

export const api = ky.create({
  prefixUrl: "http://localhost:3333",

  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined;

        // SERVER
        if (typeof window === "undefined") {
          const { cookies } = await import("next/headers");

          token = (await cookies())
            .get("token-saas-next")
            ?.value;
        }

        // CLIENT
        else {
          token = await getCookie("token-saas-next");
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
