import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { roleSchema } from '@saas_node_next_react/auth'
import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";


export async function getMembership(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug/membership', {
    schema: {
      tags: ['organizations'],
      summary: 'Get user membership on organization',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
      }),
      response: {
        200: z.object({
          result: z.object({
            membership: z.object({
              id: z.uuid(),
              role: roleSchema,
              userId: z.uuid(),
              organizationId: z.uuid()
            }).nullable()
          })
        })
      }
    }
  }, async (req, replay) => {
    const { slug } = req.params;

    const { membership } = await req.getUserMembership(slug)
   
    const result = {
      membership: {
        id: membership.id,
        role: membership.role,
        userId: membership.userId,
        organizationId: membership.organizationId
      } 
    }

    return replay.status(STATUS_CODE.SUCCESS).send({ result })
  })
}