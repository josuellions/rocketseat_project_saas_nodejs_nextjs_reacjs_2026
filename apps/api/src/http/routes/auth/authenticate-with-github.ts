import z from "zod";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import STATUS_CODE from "../../../../../../types/status";
import { BadRequestError } from "../_errors/error-bad-request";
import { env } from "@saas_node_next_react/env";

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github', {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with github',
        body: z.object({
          code: z.string()
        }),
        response: {
          201: z.object({
            token: z.string()
          })
        }
      }
    },
    async (req, replay) => {
      const { code } = req.body;
        
      // REQUEST NAVEGADOR
      // https://github.com/login/oauth/authorize?client_id=SEU_CLIENT_ID&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email
      // RESPONSE
      // http://localhost:3000/api/auth/callback?code=SEUCODE
      const githubOauthUrl = new URL('https://github.com/login/oauth/access_token');

      githubOauthUrl.searchParams.set('code', code);
      githubOauthUrl.searchParams.set('client_id', env.GTIHUB_OAUTH_CLIENT_ID);
      githubOauthUrl.searchParams.set('client_secret', env.GTIHUB_OAUTH_CLIENT_SECRET);
      githubOauthUrl.searchParams.set('redirect_uri', env.GTIHUB_OAUTH_CLIENT_REDIRECT_URI);
      
      const githubAccessTokenResponse = await fetch(githubOauthUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        }
      })

      const githubAccessTokenData = await githubAccessTokenResponse.json();

      const { access_token: githubAccessToken } = z.object({
        access_token: z.string(),
        token_type: z.literal('bearer'),
        scope: z.string()
      }).parse(githubAccessTokenData)


      const githubUserResponse = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${githubAccessToken}`
        }
      });

      const githubUserData = await githubUserResponse.json();

      const { id: githubId, name, email, avatar_url: avatarUrl } = z.object({
        id: z.number().int().transform(String),
        avatar_url: z.url(),
        name: z.string().nullable(),
        email: z.email().nullable(),
      }).parse(githubUserData);

      if(email === null) {
        throw new BadRequestError("You Github account must have an email to authenticate.");
      }

      let user = await prisma.user.findUnique({
        where: {
          email
        }
      });

      if(!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            avatarUrl
          }
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GITHUB',
            userId: user.id
          }
        }
      })

      if(!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GITHUB',
            providerAccountId: githubId,
            userId: user.id
          }
        })
      }

       const token = await replay.jwtSign(
        {
          sub: user.id
        },
        {
          sign: {
            expiresIn: '7d'
          }
        }
      )

      return replay.status(STATUS_CODE.CREATE).send({ token })

    }
  )
}
