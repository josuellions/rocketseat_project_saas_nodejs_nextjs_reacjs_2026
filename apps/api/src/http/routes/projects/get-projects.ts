import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-premissions";
import { UnauthorizedError } from "../_errors/error-unauthorized";

export async function getProjects(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug/projects', {
    schema: {
      tags: ['projects'],
      summary: 'Get all organization projects',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
      }),
      response: {
        200: z.object({
          result: z.array(
            z.object({
              id: z.uuid(),
              name: z.string(),
              description: z.string(),
              slug: z.string(),
              ownerId: z.uuid(),
              avatarUrl: z.url().nullable(),
              createdAt: z.date(),
              organizationId: z.uuid(),
              owner: z.object({
                id: z.uuid(),
                name: z.string().nullable(),
                avatarUrl: z.url().nullable()
              })
            })
          )
        })
      }
    }
  }, async (req, replay) => {
    const { slug } =  req.params;
    const userId =  await req.getCurrentUserId();
    const { organization, membership } =  await req.getUserMembership(slug);
    
    const { cannot } = getUserPermissions(userId, membership.role);

    if(cannot('get', 'Project')) {
      throw new UnauthorizedError(`You're not allowed to see organization projects.`)
    }

    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        ownerId: true,
        avatarUrl: true,
        organizationId: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      where: {
        organizationId: organization.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return replay.status(STATUS_CODE.SUCCESS).send({ result: projects })
  })
}