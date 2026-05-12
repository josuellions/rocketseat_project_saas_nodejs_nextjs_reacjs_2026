import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { roleSchema } from "@saas_node_next_react/auth";
import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";
import { prisma } from "@/lib/prisma";

export async function getOrganizations(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations', {
    schema: {
      tags: ['organizations'],
      summary: 'Get organization where user is member',
      security: [{ bearerAuth: [] }],
      response: {
        200: z.object({
          result: z.object({
            organizations: z.array( 
              z.object({
                id: z.uuid(),
                name: z.string(),
                slug: z.string(),
                avatarUrl: z.url().nullable(),
                role: roleSchema
              })
            )
          }).nullable()
        })
      }
    }
  }, async (req, replay) => {
    const userId  = await req.getCurrentUserId();

    const organizations  = await prisma.organization.findMany({
      select: {
        id: true,
        name:  true,
        slug: true,
        avatarUrl: true,
        members: {
          select: {
            role: true,
          },
          where: {
            userId
          }
        }
      },
      where: {
        members: {
          some: {
            userId
          }
        }
      }
    })
   
    const organizationsWithUserRole = organizations.map(({members, ...orgs}) => {
      return {
        ...orgs,
        role: members[0].role
      }
    })

    const result = {
      organizations: organizationsWithUserRole
    }

    return replay.status(STATUS_CODE.SUCCESS).send({ result })
  })
}