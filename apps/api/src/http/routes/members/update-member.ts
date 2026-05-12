import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-premissions";
import { UnauthorizedError } from "../_errors/error-unauthorized";
import { roleSchema } from "@saas_node_next_react/auth";

export async function updateMember(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).put('/organizations/:slug/members/:memberId', {
    schema: {
      tags: ['members'],
      summary: 'Update members',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
        memberId: z.uuid(),
      }),
      body: z.object({
        role: roleSchema,
      }),
      response: {
        204: z.null()
      }
    }
  }, async (req, replay) => {
    const { slug, memberId } =  req.params;
    const { role } = await req.body;
    const userId =  await req.getCurrentUserId();
    const { organization, membership } =  await req.getUserMembership(slug);
    
    const { cannot } = getUserPermissions(userId, membership.role);

    if(cannot('update', 'User')) {
      throw new UnauthorizedError(`You're not allowed to update this member.`)
    }

    await prisma.member.update({
      where: {
        id: memberId,
        organizationId: organization.id
      },
      data: {
        role
      }
    })


    return replay.status(STATUS_CODE.NO_CONTENT).send(null)
  })
}