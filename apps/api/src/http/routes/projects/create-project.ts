import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { createSlug } from "@/utils/create-slug";
import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-premissions";
import { UnauthorizedError } from "../_errors/error-unauthorized";

export async function createProject(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organizations/:slug/projects', {
    schema: {
      tags: ['projects'],
      summary: 'Create a new project',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string()
      }),
      body: z.object({
        name: z.string(),
        description: z.string(),
      }),
      response: {
        201: z.object({
          result: z.object({
            projectId: z.uuid()
          })
        })
      }
    }
  }, async (req, replay) => {
    const { slug } =  req.params;
    const userId =  await req.getCurrentUserId();
    const { organization, membership } =  await req.getUserMembership(slug);
    const { name, description } = req.body;

    const { cannot } = getUserPermissions(userId, membership.role);

    if(cannot('create', 'Project')) {
      throw new UnauthorizedError(`You're not allowed to create new projects.`)
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId,
        slug: createSlug(name),
        organizationId: organization.id,
        }
    })

    return replay.status(STATUS_CODE.CREATE).send({ result: { projectId: project.id } })
  })
}