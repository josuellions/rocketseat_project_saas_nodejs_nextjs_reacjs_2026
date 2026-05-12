import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-premissions";
import { UnauthorizedError } from "../_errors/error-unauthorized";
import { BadRequestError } from "../_errors/error-bad-request";

export async function getProject(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:orgSlug/projects/:projectSlug', {
    schema: {
      tags: ['projects'],
      summary: 'Get project details',
      security: [{ bearerAuth: [] }],
      params: z.object({
        orgSlug: z.string(),
        projectSlug: z.string()
      }),
      response: {
        200: z.object({
          result: z.object({
            id: z.uuid(),
            name: z.string(),
            description: z.string(),
            slug: z.string(),
            ownerId: z.uuid(),
            avatarUrl: z.url().nullable(),
            organizationId: z.uuid(),
            owner: z.object({
              id: z.uuid(),
              name: z.string().nullable(),
              avatarUrl: z.url().nullable()
            })
          })
        })
      }
    }
  }, async (req, replay) => {
    const { orgSlug, projectSlug } =  req.params;
    const userId =  await req.getCurrentUserId();
    const { organization, membership } =  await req.getUserMembership(orgSlug);
    
    const { cannot } = getUserPermissions(userId, membership.role);

    if(cannot('get', 'Project')) {
      throw new UnauthorizedError(`You're not allowed to this project.`)
    }

    const project = await prisma.project.findUnique({
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        ownerId: true,
        avatarUrl: true,
        organizationId: true,
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      where: {
        slug:  projectSlug,
        organizationId: organization.id
      }
    })

    if(!project) {
      throw new BadRequestError(`Project not found!`);
    }

    return replay.status(STATUS_CODE.SUCCESS).send({ result: project })
  })
}