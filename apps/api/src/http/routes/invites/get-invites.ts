import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-premissions";
import { UnauthorizedError } from "../_errors/error-unauthorized";
import { roleSchema } from "@saas_node_next_react/auth";

export async function getInvites(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth)
    .get('/organizations/:slug/invites', {
    schema: {
      tags: ['invites'],
      summary: 'Get all organization invites',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string()
      }),
      response: {
        200: z.object({
          result: z.object({
            invites: 
              z.array(
                z.object({
                  id: z.uuid(),
                  role: roleSchema,
                  email: z.email(),
                  createdAt: z.date(),
                  author: z.object({
                    id: z.uuid(),
                    name: z.string().nullable(),
                  }).nullable(),
                })
              )
            })
          })
        }
      }
  }, async (req, replay) => {
    const { slug } =  req.params;
    const userId =  await req.getCurrentUserId();
    const { organization, membership } =  await req.getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if(cannot('get', 'Invite')) {
      throw new UnauthorizedError(`You're not allowed to get organization invites.`)
    }

    const invites = await prisma.invite.findMany({
      where: {
        organizationId: organization.id
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return replay.status(STATUS_CODE.SUCCESS).send({ result: { invites }  })
  })
}