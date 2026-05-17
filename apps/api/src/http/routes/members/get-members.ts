import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-premissions";
import { UnauthorizedError } from "../_errors/error-unauthorized";
import { roleSchema } from "@saas_node_next_react/auth";

export async function getMembers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug/members', {
    schema: {
      tags: ['members'],
      summary: 'Get all organization members',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
      }),
      response: {
        200: z.object({
          result: z.object({
            members: z.array(
              z.object({
                id: z.string(),
                userId: z.string(),
                role: roleSchema,
                name: z.string().nullable(),
                avatarUrl: z.url().nullable(),
                email: z.email()
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

    if(cannot('get', 'User')) {
      throw new UnauthorizedError(`You're not allowed to see organization members.`)
    }

    const members = await prisma.member.findMany({
      select: {
        id:true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          }
        }
      },
      where: {
        organizationId: organization.id
      },
      orderBy: {
        role: 'asc'
      }
    })

    const memberWithRoles = members.map(({user: { id: userId, ...user}, ...member}) => {
      return {
        ...user,
        ...member,
        userId,
      }
    })

    return replay.status(STATUS_CODE.SUCCESS).send({ result: { members: memberWithRoles } })
  })
}