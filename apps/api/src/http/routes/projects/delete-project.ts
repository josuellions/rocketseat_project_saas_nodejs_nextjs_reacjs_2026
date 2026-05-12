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

export async function deleteProject(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organizations/:slug/projects/:projectId', {
    schema: {
      tags: ['projects'],
      summary: 'Delete a project',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
        projectId: z.uuid()
      }),
      response: {
        204: z.null()
      }
    }
  }, async (req, replay) => {
    const { slug, projectId } =  req.params;
    const userId =  await req.getCurrentUserId();
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

    if(cannot('delete', authProject)) {
      throw new UnauthorizedError(`You're not allowed to delete this project.`)
    }

    await prisma.project.delete({
      where: {
        id:  project.id
      }
    })

    return replay.status(STATUS_CODE.NO_CONTENT).send(null)
  })
}