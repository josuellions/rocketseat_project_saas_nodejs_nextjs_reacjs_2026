import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { createSlug } from "@/utils/create-slug";
import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-premissions";
import { UnauthorizedError } from "../_errors/error-unauthorized";
import { projectSchema } from "@saas_node_next_react/auth";

export async function updateProject(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).put('/organizations/:slug/projects/:projectId', {
    schema: {
      tags: ['projects'],
      summary: 'Update a project',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
        projectId: z.uuid()
      }),
      body: z.object({
        name: z.string(),
        description: z.string()
      }),
      response: {
        204: z.null()
      }
    }
  }, async (req, replay) => {
    const { slug, projectId } =  req.params;
    const userId =  await req.getCurrentUserId();
    const { name, description } = await req.body;
    const { organization, membership } =  await req.getUserMembership(slug);

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        organizationId: organization.id
      }
    })

    if(!project) {
      throw new UnauthorizedError(`Project not found!`)
    }

    const { cannot } = getUserPermissions(userId, membership.role);
    const authProject =  projectSchema.parse(project)

    if(cannot('update', authProject)) {
      throw new UnauthorizedError(`You're not allowed to update this project.`)
    }

    await prisma.project.update({
      data: {
        name,
        description
      },
      where: {
        id:  project.id
      }
    })

    return replay.status(STATUS_CODE.NO_CONTENT).send(null)
  })
}