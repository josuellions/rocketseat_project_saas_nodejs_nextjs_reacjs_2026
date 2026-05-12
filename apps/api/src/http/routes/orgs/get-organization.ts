import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

export async function getOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug', {
    schema: {
      tags: ['organizations'],
      summary: 'Get details from organization',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
      }),
      response: {
        200: z.object({
          result: z.object({
            organization: z.object({
              id: z.uuid(),
              name: z.string(),
              ownerId: z.uuid(),
              slug: z.string(),
              domain: z.string().nullable(),
              shouldAttachUsersByDomain: z.boolean(),
              avatarUrl: z.url().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }).nullable()
          })
        })
      }
    }
  }, async (req, replay) => {
    const { slug } = req.params;

    const { organization } = await req.getUserMembership(slug)
   
    const result = {
      organization
    }

    return replay.status(STATUS_CODE.SUCCESS).send({ result })
  })
}