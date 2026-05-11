import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { organizationSchema  } from "@saas_node_next_react/auth";
import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { UnauthorizedError } from "../_errors/error-unauthorized";
import { getUserPermissions } from "@/utils/get-user-premissions";

export async function deleteOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organization/:slug', {
    schema: {
      tags: ['organizations'],
      summary: 'Delete organization',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string()
      }),
      response: {
        204: z.null()
      }
    }
  }, async (req, replay) => {
    const { slug } = req.params
    const userId =  await req.getCurrentUserId();
    const { membership, organization } =  await req.getUserMembership(slug);

    const authOrganization = organizationSchema.parse({
      id: organization.id,
      ownerId: organization.ownerId
    })

    const { cannot } = getUserPermissions(userId, membership.role )

    if(cannot('delete', authOrganization)) {
      throw new UnauthorizedError(`You're not allowed to delete this organization.`)
    }


    await prisma.organization.delete({
      where: {
        id: organization.id
      },
    })

    return replay.status(STATUS_CODE.NO_CONTENT).send(null)
  })
}